namespace :gup_migrations do
  desc "Remove sourcetitle field"
  task :remove_sourcetitle_field_from_artistic => :environment do
    f = Field.find_by_name("sourcetitle")
    pt = PublicationType.find_by_code('artistic-work_original-creative-work')
    Fields2publicationType.where(publication_type_id: pt).where(field_id: f).first.destroy
  end
end