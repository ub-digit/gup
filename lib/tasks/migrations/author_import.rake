namespace :gup_migrations do
  desc "Prepare for GUP Admin author imports"
  task :add_data_for_author_import => :environment do
    Source.where({name: 'scopus-auth-id'}).first_or_create
    Department.where({id: 667, name_sv: 'Import', name_en: 'Import',  start_year: 1900, end_year: nil, faculty_id: nil, parentid: nil, grandparentid: nil, created_by: "system", updated_by: "system", staffnotes: nil, palassoid: nil, kataguid: nil, is_internal: false}).first_or_create
  end
end
