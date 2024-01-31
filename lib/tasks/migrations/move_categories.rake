namespace :gup_migrations do
  desc "Replace HSV LOCAL 12 category with HSV 11"
  task :replace_categories => :environment do
    ActiveRecord::Base.logger.level = 2
    not_updated = 0
    updated = 0
    Publication.published.non_deleted.each do |publication|
      if publication.current_version.categories.pluck(:category_type).include?('HSV_11')
        puts "Publication #{publication.id} already contans a category with type HSV_11"
        not_updated += 1
      else
        hsv_12_categories = publication.current_version.categories.where(category_type: "HSV_LOCAL_12")
        hsv_11_categories = Category.where(id: publication.current_version.categories.where(category_type: "HSV_LOCAL_12").map{|c| c.mapping_id})
        puts "Publication #{publication.id} has HSV_LOCAL_12 categories that will be mapped to HSV_11 categories"
        hsv_11_categories.each do |c|
          Categories2publication.create({publication_version_id: publication.current_version.id, category_id: c.id})
        end
        updated += 1
      end
    end
    puts "\n"
    puts "Number of updated publications: #{updated}"
    puts "Number of unchanged publications: #{not_updated}"
  end

  desc "Change category field name in database"
  task :change_category_field_name => :environment do
    Field.find_by_name("category_hsv_local").update_attribute(:name, 'category_hsv_11')
  end
end