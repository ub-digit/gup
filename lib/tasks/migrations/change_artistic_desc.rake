namespace :gup_migrations do
  desc "Change description for publication type artistic work"
  task :change_artistic_desc => :environment do
    pt = PublicationType.find_by_code("artistic-work_original-creative-work")
    pt.description_sv = ("Avser konstnärligt arbete som antingen har genomgått sakkunniggranskning eller inte.")
    pt.description_en = ("Refers to artistic work that has either undergone peer review or not.")
    pt.save  
  end
end