namespace :gup_admin do
  desc "Put publications to GUP admin index manager"
  task :index_all => :environment do
    limit = ENV['LIMIT']
    offset = ENV['OFFSET']
    exit if limit.blank? || offset.blank?

    GupAdmin.index_all limit: limit.to_i, offset:offset.to_i
  end

  desc "Match publications with scopus documents"
  task :match_publications => :environment do
    in_file = ENV['IN']
    out_file = ENV['OUT']
    source = ENV['SOURCE']
    File.open(out_file, "w") do |out_line|
      File.open(in_file).each do |in_line|
        data = JSON.parse(in_line)
        ["doi", source].each do |code|
          data = get_matched_publications data, code
        end
        print data.inspect + "\n"
        out_line.write data.inspect + "\n"
      end
    end
  end

  desc "Prepare calls to GUP Admin"
  task :prepare_gup_admin_calls_for_scopus => :environment do
    in_file = ENV['IN']
    base_url = ENV['BASE_URL']
    user = ENV['USER']
    out_dir = ENV['OUT_DIR']

    post_file_line = File.open("#{out_dir}/POST_file.txt", "w")
    post_delete_line = File.open("#{out_dir}/DELETE_file.txt", "w")
    duplicate = 0
    no_match = 0
    scopus_match_no_doi = 0
    scopus_match_with_doi = 0
    doi_match = 0
    both_match = 0
    File.open(in_file).each do |in_line|
      row = eval(in_line)
      if row["doi-check-duplicates"] == 1 || row["scopus-id-check-duplicates"] == 1
        duplicate += 1
        next
      end
      if row["doi-number-of-matches"] == 0 && row["scopus-id-number-of-matches"] == 0
        no_match += 1
        next
      end
      if row["doi-number-of-matches"] == 0 && row["scopus-id-number-of-matches"] == 1 && !row["doi"]
        scopus_match_no_doi += 1
        next
      end
      if row["doi-number-of-matches"] == 0 && row["scopus-id-number-of-matches"] == 1
        scopus_match_with_doi += 1
        create_post_and_delete_row(post_file_line, "scopus", row["scopus-id"], row["scopus-id-matched-publication-id"].first, base_url, user)
      end

      if row["doi-number-of-matches"] == 1 && row["scopus-id-number-of-matches"] == 0
        doi_match += 1
        create_post_and_delete_row(post_file_line, "scopus", row["scopus-id"], row["doi-matched-publication-id"].first, base_url, user)
      end
      if row["doi-number-of-matches"] == 1 && row["scopus-id-number-of-matches"] == 1
        both_match += 1
        create_delete_row(post_delete_line, "scopus", row["scopus-id"], base_url, user)
      end
    end
    post_file_line.close
    post_delete_line.close

    puts "duplicate: #{duplicate}"
    puts "no_match: #{no_match}"
    puts "scopus_match_no_doi: #{scopus_match_no_doi}"
    puts "scopus_match_with_doi: #{scopus_match_with_doi}"
    puts "doi_match: #{ doi_match}"
    puts "both_match: #{both_match}"
  end

  desc "Prepare calls to GUP Admin"
  task :prepare_gup_admin_calls_for_wos => :environment do
    in_file = ENV['IN']
    base_url = ENV['BASE_URL']
    user = ENV['USER']
    out_dir = ENV['OUT_DIR']

    post_file_line = File.open("#{out_dir}/POST_file.txt", "w")
    post_delete_line = File.open("#{out_dir}/DELETE_file.txt", "w")
    duplicate = 0
    no_match = 0
    wos_match_no_doi = 0
    wos_match_with_doi = 0
    doi_match = 0
    both_match = 0
    File.open(in_file).each do |in_line|
      row = eval(in_line)
      if row["doi-check-duplicates"] == 1 || row["isi-id-check-duplicates"] == 1
        duplicate += 1
        next
      end
      if row["doi-number-of-matches"] == 0 && row["isi-id-number-of-matches"] == 0
        no_match += 1
        next
      end
      if row["doi-number-of-matches"] == 0 && row["isi-id-number-of-matches"] == 1 && !row["doi"]
        wos_match_no_doi += 1
        next
      end
      if row["doi-number-of-matches"] == 0 && row["isi-id-number-of-matches"] == 1
        wos_match_with_doi += 1
        create_post_and_delete_row(post_file_line, "WOS", row["isi-id"], row["isi-id-matched-publication-id"].first, base_url, user)
      end

      if row["doi-number-of-matches"] == 1 && row["isi-id-number-of-matches"] == 0
        doi_match += 1
        create_post_and_delete_row(post_file_line, "WOS", row["isi-id"], row["doi-matched-publication-id"].first, base_url, user)
      end
      if row["doi-number-of-matches"] == 1 && row["isi-id-number-of-matches"] == 1
        both_match += 1
        create_delete_row(post_delete_line, "WOS", row["isi-id"], base_url, user)
      end
    end
    post_file_line.close
    post_delete_line.close

    puts "duplicate: #{duplicate}"
    puts "no_match: #{no_match}"
    puts "wos_match_no_doi: #{wos_match_no_doi}"
    puts "wos_match_with_doi: #{wos_match_with_doi}"
    puts "doi_match: #{ doi_match}"
    puts "both_match: #{both_match}"
  end



  def get_matched_publications data, identifier_code
    sql = "select p.id from publications p
    join publication_versions pv on pv.id = p.current_version_id
    join publication_identifiers pi on pi.publication_version_id = pv.id
    where p.deleted_at is null
    and p.published_at is not null
    and pi.identifier_code = ?
    and lower(pi.identifier_value) = lower(?)"

    value = data[identifier_code]
    res = Publication.find_by_sql([sql, identifier_code, value])
    ids = []
    count = 0
    res.each_with_index do |r, index|
      count += 1
      ids << r.id
    end
    data["#{identifier_code}-matched-publication-id"] = ids
    data["#{identifier_code}-number-of-matches"] = count
    data["#{identifier_code}-check-duplicates"] = (count > 1 ? 1 : 0)
    return data
  end

  def create_post_and_delete_row file_line, source, ext_id, gup_id, base_url, user
    file_line.write "curl -X POST " + base_url + "/publications/merge/" + source + "_" + ext_id + "/gup_" + gup_id.to_s + "/" + user + "\n"
    file_line.write "curl -X DELETE " + base_url + "/publications/" + source + "_" + ext_id + "\n"
  end

  def create_delete_row file_line, source, ext_id, base_url, user
    file_line.write "curl -X DELETE " + base_url + "/publications/" + source + "_" + ext_id + "\n"
  end
end
