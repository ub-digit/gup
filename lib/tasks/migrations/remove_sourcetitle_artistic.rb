namespace :gup_migrations do
  desc "Remove sourcetitle field"
  task :made_public_in => :environment do
    f = Field.find_by_name("sourcetitle")
    pt = PublicationType.find_by_code('artistic-work_original-creative-work')
    Fields2publicationType.where(publication_type_id: pt).where(field_id: f).first.destroy
  end
end