namespace :oa do
  desc "Check a batch of publication_links for OA status via Unpaywall"
  task check_next_publication_link: :environment do
    email = ENV["UNPAYWALL_EMAIL"] || ENV["EMAIL"] || "gup@ub.gu.se"
    batch_size = (ENV["BATCH"] || "100").to_i
    batch_size = 10 if batch_size <= 0

    recent_threshold = Time.current - 1.day

    candidates = PublicationLink
      .where("oa <> true OR oa IS NULL")
      .where("publication_version_id IN (SELECT current_version_id FROM publications)")
      .where("url ~* ?", '10\.\d+/')
      .where("checked_at IS NULL OR checked_at < ?", recent_threshold)
      .order(id: :desc)
      .limit(batch_size)

    processed = 0

    puts "----------"
    puts "Checking OA status at #{Time.current.iso8601}"
    puts candidates.to_sql
    puts "batch_size=#{batch_size}"

    candidates.each do |publication_link|
      break if processed >= batch_size

      next if publication_link.oa == true
      next if publication_link.checked_at.present? &&
              publication_link.checked_at >= recent_threshold

      doi = Unpaywall.extract_doi(publication_link.url)
      next if doi.blank?

      puts
      puts "publication_link.id=#{publication_link.id}"
      puts "url=#{publication_link.url}"
      puts "doi=#{doi}"

      oa_status = Unpaywall.oa_status_for_doi(doi, email: email)
      now = Time.current

      if oa_status == "error"
        puts "Skipping publication_link #{publication_link.id} due to network/API error."
        next
      end

      case oa_status
      when true
        publication_link.update!(
          oa: true,
          checked_at: now
        )
        puts "publication_link #{publication_link.id} set to OA"

      when false
        publication_link.update!(
          oa: false,
          checked_at: now
        )
        puts "publication_link #{publication_link.id} set to not OA"

      when "unknown"
        publication_link.update!(
          checked_at: now
        )
        puts "publication_link #{publication_link.id} not found in Unpaywall"
      end

      pub_id = publication_link.publication_version.publication_id
      puts "Indexing publication #{pub_id}..."
      GupAdminPublication.put_to_index(pub_id)

      processed += 1
      puts "Processed #{processed} records so far..."

      sleep 0.2
    end

    puts
    puts "Processed #{processed} records."
  end
end