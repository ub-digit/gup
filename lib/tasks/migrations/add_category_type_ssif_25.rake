namespace :gup_migrations do
  desc "Add new categories for SSIF_25"
  task :add_categories => :environment do
    # First, check if there is a category with the type SSIF_25, if there is exit script to avoid duplicates
    if Category.where(category_type: 'SSIF_25').any?
      puts "Categories already exist, delete them first"
      exit
    end
    # Categories are specified in an Excel file, open it by using Roo gem and read each line
    # The filepath and filename are provided by a parameter in the command line
    file = ARGV[1]
    # exit if file is not provided
    if file.nil?
      puts "Please provide a file with categories"
      exit
    end
    xlsx = Roo::Spreadsheet.open(file)
    area_code = nil
    group_code = nil
    subject_code = nil
    area_name_sv = nil
    area_name_en = nil
    group_name_sv = nil
    group_name_en = nil
    subject_name_sv = nil
    subject_name_en = nil
    area_id = nil
    group_id = nil
    basic_data = {created_at: Time.now, updated_at: Time.now, category_type: 'SSIF_25'}
    # Skip the first row, it contains the headers
    2.upto(xlsx.last_row) do |line|
      # Check if there is a value in column A
      if xlsx.cell(line, 'A').present?
        area_code = xlsx.cell(line, 'A')
        area_name_sv = xlsx.cell(line, 'D')
        area_name_en = xlsx.cell(line, 'E')
        puts area_code
        c = Category.new({node_type: 'root', node_level: 0, svepid: area_code, name_sv: area_name_sv, name_en: area_name_en}.merge(basic_data))
        pp c
        c.save
        area_id = c.id
      elsif xlsx.cell(line, 'B').present?
        group_code = xlsx.cell(line, 'B')
        group_name_sv = xlsx.cell(line, 'D')
        group_name_en = xlsx.cell(line, 'E')
        puts area_code
        puts group_code
        c = Category.new({node_type: 'intermediate', node_level: 1, svepid: group_code, parent_id: area_id, name_sv: group_name_sv, name_en: group_name_en, sv_name_path: area_name_sv, en_name_path: area_name_en}.merge(basic_data))
        pp c
        c.save
        group_id = c.id
      elsif xlsx.cell(line, 'C').present?
        subject_code = xlsx.cell(line, 'C')
        subject_name_sv = xlsx.cell(line, 'D')
        subject_name_en = xlsx.cell(line, 'E')
        puts area_code
        puts group_code
        puts subject_code
        c = Category.new({node_type: 'leaf', node_level: 2, svepid: subject_code, parent_id: group_id, name_sv: subject_name_sv, name_en: subject_name_en, sv_name_path: area_name_sv + '|' + group_name_sv, en_name_path: area_name_en + '|' + group_name_en}.merge(basic_data))
        pp c
        c.save
      end
    end
  end

  desc "Change category field name in database"
  task :change_category_field_name => :environment do
    Field.find_by_name("category_hsv_11").update_attribute(:name, 'category_current_type')
  end

  desc "Map categories for all publications from HSV_11 to SSIF_25"
    task :map_categories => :environment do
    # Category mappings are specified in an Excel file, open it by using Roo gem and read each line
    # The filepath and filename are provided by a parameter in the command line
    # The data is in the sheet 2
    file = ARGV[1]
    # exit if file is not provided
    if file.nil?
      puts "Please provide a file with categories"
      exit
    end
    xlsx = Roo::Spreadsheet.open(file)
    # the data is in the sheet 2
    xlsx.default_sheet = xlsx.sheets[1]
    category_mappings = {}
    # Skip the first row, it contains the headers
    2.upto(xlsx.last_row) do |line|
      # Category for HSV_11 are specified in column C and the corresponding category for SSIF_25 in column A
      hsv_11_code = xlsx.cell(line, 'C')
      ssif_25_code = xlsx.cell(line, 'A')
      category_mappings[hsv_11_code] = ssif_25_code if hsv_11_code.present?
    end
    # print the mappings where SSIF_25 is not present
    puts "Mappings where SSIF_25 is not present"
    category_mappings.each do |k, v|
      puts "#{k}" if v.nil?
    end
    
    # Include the remaining mappings in category_mappings
    # 10209	102
    # 10306	10301
    # 20108	20102
    # 20303	20302
    # 20308	20399
    # 20404	20499
    # 20701	20703
    # 20706	20705
    # 20804	20899
    # 20907	20901
    # 20908	20905
    # 21001	210
    # 21102	211
    # 21103	211
    # 40503	40599
    # 50303	503
    # 50403	50401
    # 50901	50999
    # 50603	50703
    # 50802	50801
    # 50803	50804
    category_mappings[10209] = 102
    category_mappings[10306] = 10301
    category_mappings[20108] = 20102
    category_mappings[20303] = 20302
    category_mappings[20308] = 20399
    category_mappings[20404] = 20499
    category_mappings[20701] = 20703
    category_mappings[20706] = 20705
    category_mappings[20804] = 20899
    category_mappings[20907] = 20901
    category_mappings[20908] = 20905
    #category_mappings[21001] = 210 # Ej inlagd i GUP
    category_mappings[21102] = 211
    category_mappings[21103] = 211
    category_mappings[40503] = 40599
    category_mappings[50303] = 503
    category_mappings[50403] = 50401
    category_mappings[50901] = 50999
    category_mappings[50603] = 50703
    category_mappings[50802] = 50801
    category_mappings[50803] = 50804

 

    category_id_mappings = {}
    category_mappings.each do |k, v|
      hsv_11_category = Category.find_by(svepid: k)
      ssif_25_category = Category.find_by(svepid: v)
      if hsv_11_category.present? && ssif_25_category.present?
        category_id_mappings[hsv_11_category.id] = ssif_25_category.id
      else
        puts "Category with svepid #{k} or #{v} not found"
      end
    end

    ActiveRecord::Base.logger.level = 2
    not_updated = 0
    updated = 0
    Publication.published.non_deleted.each do |publication|
      if publication.current_version.categories.pluck(:category_type).include?('SSIF_25')
        puts "Publication #{publication.id} already contans a category with type SSIF_25"
        not_updated += 1
      else
        hsv_11_categories = publication.current_version.categories.where(category_type: "HSV_11")
        pp hsv_11_categories
        ssif_25_categories = hsv_11_categories.map{|c| category_id_mappings[c.id]}
        pp ssif_25_categories
        puts "Publication #{publication.id} has HSV_11 categories that will be mapped to SSIF categories"
        ssif_25_categories.each do |c|
          puts c
          # Create a new category for the publication, only if it does not exist
          Categories2publication.create({publication_version_id: publication.current_version.id, category_id: c}) unless publication.current_version.categories.pluck(:id).include?(c)
        end
        updated += 1
      end
    end
    puts "\n"
    puts "Number of updated publications: #{updated}"
    puts "Number of unchanged publications: #{not_updated}"

  end
end