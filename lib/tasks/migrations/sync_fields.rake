namespace :gup_migrations do
  desc "Sync publication types fields"
  task :sync_fields => :environment do
    require 'csv'
    require 'pp'
    # PublicationType.destroy_all
    # Field.destroy_all
    # Fields2publicationType.destroy_all
    # TODO: Right now only able to add existing fields
    # add code to handle publication_types and fields if needed

    publication_types_fields = CSV.read('publication_types_fields.csv')

    publication_types = publication_types_fields.transpose[0].uniq
    publication_types_ids = publication_types.map do |publication_type|
      [publication_type, PublicationType.find_by(code: publication_type).id]
    end.to_h

    field_names = publication_types_fields.transpose[1].uniq
    field_names_ids = field_names.map do |field_name|
      [field_name, Field.find_or_create_by(name: field_name).id]
    end.to_h

    publication_types_fields.each do |row|
      publication_type = row[0]
      field_name = row[1]
      rule = row[2]
      existing = Fields2publicationType.find_by(
        publication_type_id: publication_types_ids[publication_type],
        field_id: field_names_ids[field_name]
      )
      if !existing
        Fields2publicationType.create(
          publication_type_id: publication_types_ids[publication_type],
          field_id: field_names_ids[field_name],
          rule: rule
        )
        puts "Added new field \"#{field_name}\" to \"#{publication_type}\" with rule \"#{rule}\""
      elsif existing.rule != rule
        existing_rule = existing.rule
        existing.rule = rule
        existing.save
        puts "Updated rule for \"#{field_name}\" in \"#{publication_type}\", \"#{existing_rule}\" => \"#{rule}\""
      end
    end
  end
end
