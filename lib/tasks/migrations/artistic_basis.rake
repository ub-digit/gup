namespace :gup_migrations do
  desc "Sync publication types fields"
  task :artistic_basis => :environment do
    f = Field.create(name: "artistic_basis")
    PublicationType.where.not(code: 'artistic-work_original-creative-work').each do |pt|
      Fields2publicationType.create(field_id: f.id, publication_type_id: pt.id, rule: 'O')
    end
  end
end