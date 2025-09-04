namespace :gup_migrations do
  desc "Add missing orgdbids for organisations"
  task :add_missing_orgdbids => :environment do

    # Loop through the CSV that are located in the project root, Separator is semicolon
    count = 0
    CSV.foreach('org_pop_to_gup.csv', col_sep: ';') do |row|
      #pp row
      type = row[2]
      if ["Huvudorganisation", "Rektor", "Fakultet"].include?(type)
        puts "Found organisation type: #{type}, ignore"
        next
      end

      orgnr = row[1]
      orgdbid = row[0]
      pp orgnr
      pp orgdbid

      department_list = Department.where(orgnr: orgnr)
      #pp d
      if department_list.empty?
        puts "No departments found for orgnr: #{orgnr}"
      else
        puts "Departments found for orgnr: #{orgnr}"
        department_list.each do |department|
          if department.orgdbid.present?
            puts "Department (#{department.id}) already has orgdbid: #{department.orgdbid}"
          else
            puts "Department (#{department.id}) does not have orgdbid, and will be updated with orgdbid: #{orgdbid}"
            count += 1
            department.orgdbid = orgdbid
            department.save
          end
        end
      end
    end
    puts "Total organisations processed: #{count}"
  end

  desc "Add missing orgnumbers for organisations"
  task :add_missing_orgnumbers => :environment do

    # Loop through the CSV that are located in the project root, Separator is semicolon
    count = 0
    CSV.foreach('org_pop_to_gup.csv', col_sep: ';') do |row|
      #pp row
      type = row[2]
      if ["Huvudorganisation", "Rektor", "Fakultet"].include?(type)
        puts "Found organisation type: #{type}, ignore"
        next
      end

      orgnr = row[1]
      orgdbid = row[0]
      pp orgnr
      pp orgdbid

      department_list = Department.where(orgdbid: orgdbid)
      #pp d
      if department_list.empty?
        puts "No departments found for orgdbid: #{orgdbid}"
      else
        puts "Departments found for orgdbid: #{orgdbid}"
        department_list.each do |department|
          if department.orgnr.present?
            puts "Department (#{department.id}) already has orgnr: #{department.orgnr}"
          else
            puts "Department (#{department.id}) does not have orgnr, and will be updated with orgnr: #{orgnr}"
            count += 1
            department.orgnr = orgnr
            department.save
          end
        end
      end
    end
    puts "Total organisations processed: #{count}"
  end

  desc "Add missing organisations"
  task :add_missing_organisations => :environment do
    count_creation = 0
    count_no_creation = 0
    CSV.foreach('org_pop_to_gup.csv', col_sep: ';') do |row|
      #pp row
      type = row[2]
      if ["Huvudorganisation", "Rektor", "Fakultet"].include?(type)
        puts "Found organisation type: #{type}, ignore"
        next
      end

      orgnr = row[1]
      orgdbid = row[0]
      # Get the first 4 characters of the start year
      startyear = row[3][0..3]
      name_sv = row[6]
      name_en = row[7]
      pp orgnr
      pp orgdbid
      pp startyear
      pp name_sv
      pp name_en

      # Check if there are departments that not have orgnr
      department_list = Department.where(orgnr: orgnr)
      if department_list.empty?
        puts "No departments found for orgnr: #{orgnr}, creating new department"
        faculty_id = get_faculty_id(orgnr)
        pp faculty_id
        d = Department.new(
          orgnr: orgnr,
          orgdbid: orgdbid,
          start_year: startyear,
          name_sv: name_sv,
          name_en: name_en,
          faculty_id: faculty_id,
          created_by: "import",
          updated_by: "import",
          staffnotes: "Import från POP-data 2025-09"
        )
        d.save
        count_creation += 1
      else
        puts "Departments found for orgnr: #{orgnr}, skipping creation"
        count_no_creation += 1
      end
    end
    puts "Total organisations created: #{count_creation}"
    puts "Total organisations skipped: #{count_no_creation}"
  end

  desc "Add missing parentids for organisations"
  task :add_missing_parentids => :environment do
    not_found = 0
    found_parentid = 0
    found_no_parentid = 0
    found_no_parentid_parent_found = 0
    found_no_parentid_parent_not_found = 0
    CSV.foreach('org_parentid_mapping.csv', col_sep: ';') do |row|
      orgnr = row[1]
      orgnr_parent = row[2]
      puts "Processing orgnr: #{orgnr}, orgnr_parent: #{orgnr_parent}"

      department = Department.where(created_by: 'import').find_by(orgnr: orgnr)
      if department
        if department.parentid.present?
          found_parentid += 1
          puts "Department (#{department.id}) already has parentid: #{department.parentid}"
        else
          found_no_parentid += 1
          puts "Department (#{department.id}) does not have parentid"
          parent_department = Department.find_by(orgnr: orgnr_parent)
          if parent_department
            found_no_parentid_parent_found += 1
            puts "Found parent department (#{parent_department.id}) for orgnr: #{orgnr_parent}"
            department.parentid = parent_department.id
            department.save
          else
            puts "No parent department found for orgnr: #{orgnr_parent}"
            found_no_parentid_parent_not_found += 1
          end
        end
      else
        not_found += 1
        puts "No department found for orgnr: #{orgnr}"
      end
    end
    puts "Total departments not found: #{not_found}"
    puts "Total departments found with parentid: #{found_parentid}"
    puts "Total departments found without parentid: #{found_no_parentid}"
    puts "Total departments without parentid but parent found: #{found_no_parentid_parent_found}"
    puts "Total departments without parentid but parent not found: #{found_no_parentid_parent_not_found}"
  end

  def get_faculty_id(orgnr)
    # if string length is 2, return 665
    return 665 if orgnr.length == 2
    faculty_code = orgnr[0..1]

    if faculty_code == "01"
      # Fakulteten för naturvetenskap och teknik (2025-)
      return 142
    elsif faculty_code == "02"
      # Samhällsvetenskapliga fakulteten
      return 64
    elsif faculty_code == "03"
      # Sahlgrenska akademin
      return 81
    elsif faculty_code == "04"
      # Utbildningsvetenskapliga fakulteten
      return 102
    elsif faculty_code == "05"
      # Humanistiska fakulteten
      return 122
    elsif faculty_code == "08"
      # Konstnärliga fakulteten
      return 63
    elsif faculty_code == "09"
      # Handelshögskolan
      return 61
    elsif faculty_code == "10"
      return 121
    else
      puts "Unknown faculty code: #{faculty_code}, returning 665"
      return 665
    end
  end
end

