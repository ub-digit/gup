namespace :gup_migrations do
  desc "Add publication field"
  task :made_public_in => :environment do
    f = Field.create(name: "made_public_in")
    pt = PublicationType.find_by_code('artistic-work_original-creative-work')
    Fields2publicationType.create(field_id: f.id, publication_type_id: pt.id, rule: 'R')
  end
end