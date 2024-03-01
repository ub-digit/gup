namespace :gup_migrations do
  desc "Change category field name in database"
  task :change_category_field_name => :environment do
    Field.find_by_name("category_hsv_local").update_attribute(:name, 'category_hsv_11')
  end
end