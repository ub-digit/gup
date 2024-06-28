namespace :gup_migrations do
  desc "Add affiliations to publications"
  task :add_affiliations => :environment do
    # The input file should be a json file with the following structure:
    # {"publications":
    #   [
    #     {"pubId": "56209", "authors": ["63164"]},
    #     {"pubId": "335726", "authors": ["84113", "84649"]},
    #     {"pubId": "335993", "authors": ["172560"]}
    #   ]
    # }
    in_file = ENV['IN']
    execute = ENV['EXECUTE']
    if execute.present? && execute == "true"
      puts "Execute is true"
      update = true
    else
      puts "Execute is false"
      update = false
    end

    department_id = Department.find_by_name_sv("Språkbanken Text, Institutionen för svenska, flerspråkighet och språkteknologi").id
    # read the file as json
    data = JSON.parse(File.read(in_file))
    data["publications"].each do |row|
      begin
        pv_id = Publication.find(row["pubId"].to_i).current_version_id
        puts row["pubId"] + ": "  + pv_id.to_s

        row["authors"].each do |p_id|
          person = Person.find(p_id.to_s)
          puts "  " + person.id.to_s

          p2p = People2publication.where(publication_version_id: pv_id).where(person_id: person.id)
          if p2p.empty?
            puts "No affiliation found for " + person.id.to_s
            next
          end
          if p2p.count > 1
            puts "Multiple affiliations found for " + person.id.to_s
            next
          end
          p2p_id = p2p.first.id

          d2p2p = Departments2people2publication.where(department_id: department_id).where(people2publication_id: p2p_id)
          if !d2p2p.empty?
            puts "Affiliation already exists for " + person.id.to_s
            next
          else
            # get the max position for this person2publication
            max_position = Departments2people2publication.where(people2publication_id: p2p_id).maximum(:position)
            puts "Max position for " + person.id.to_s + " is " + max_position.to_s
            if update
              puts "Adding affiliation for " + person.id.to_s
              Departments2people2publication.create(department_id: department_id, people2publication_id: p2p_id, position: max_position + 1)
            else
              puts "Dry run: Adding affiliation for " + person.id.to_s
            end
          end
        end
      rescue ActiveRecord::RecordNotFound => e
        puts e
      end
    end
  end
end