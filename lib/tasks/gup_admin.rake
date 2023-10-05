namespace :gup_admin do
  desc "Put publications to GUP admin index manager"
  task :index_all => :environment do
    limit = ENV['LIMIT']
    offset = ENV['OFFSET']
    exit if limit.blank? || offset.blank?

    GupAdmin.index_all limit: limit.to_i, offset:offset.to_i
  end
end
