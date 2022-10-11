namespace :gup_migrations do
  desc "Delete fields for artistic work publication type"
  task :delete_fields_artistic_work => :environment do
    pt = PublicationType.find_by_code('artistic-work_original-creative-work').id
    f = Field.where(name: ["isbn", "extent", "publisher", "place", "series"]).pluck(:id)
    Fields2publicationType.where(publication_type_id: pt).where(field_id: f).each{ |f2pt| f2pt.destroy}
  end
end
