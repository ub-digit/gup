class GupAdminOrganisation
  FACULTY_AFFILIATION_MISSING_ID = 665
  def self.put_to_index organisation
    puts "Index organisation #{organisation.inspect}"
    response = RestClient.post "#{APP_CONFIG['gup_admin_settings']['backend_base_url']}/api/departments?api_key=#{APP_CONFIG['gup_admin_settings']['backend_api_key']}", organisation.to_json , content_type: :json
    return response
  end

  def self.index_faculties
    Faculty.all.each do |faculty|
      # Get the faculty id
      id = faculty.id
      # Get the faculty name
      name_sv = faculty.name_sv
      name_en = faculty.name_en
      start_year = 1900
      end_year = nil
      is_internal = true
      staffnotes = nil
      orgnr = GupAdminOrganisation.faculty_id_mapping[id][:orgnr]
      orgdbid = GupAdminOrganisation.faculty_id_mapping[id][:orgdbid]
      data = {id: id, name_sv: name_sv, name_en: name_en, start_year: start_year, end_year: end_year, staffnotes: staffnotes, orgnr: orgnr, orgdbid: orgdbid}
      parent_id = nil
      is_faculty = true
      document = {id: id, parent_id: parent_id, is_faculty: is_faculty, data: data}
      # Index the faculty
      begin
        GupAdminOrganisation.put_to_index document
      rescue RestClient::ExceptionWithResponse => e
        # Handle the error
        puts "Error indexing faculty #{id}: #{e.response}"
      end
    end
  end

  def self.index_departments
    Department.all.each do |department|
      # Get the department id
      id = department.id
      # Get the department name
      name_sv = department.name_sv
      name_en = department.name_en
      start_year = department.start_year ? department.start_year : 1900
      end_year = department.end_year
      is_internal = department.is_internal
      staffnotes = department.staffnotes
      orgnr = department.orgnr
      orgdbid = department.orgdbid
      data = {id: id, name_sv: name_sv, name_en: name_en, start_year: start_year, end_year: end_year, staffnotes: staffnotes, orgnr: orgnr, orgdbid: orgdbid}
      if department.parentid
        parent_id = department.parentid
      elsif department.faculty_id
        parent_id = department.faculty_id
      else
        parent_id = FACULTY_AFFILIATION_MISSING_ID
      end
      is_faculty = false
      document = {id: id, parent_id: parent_id, is_faculty: is_faculty, data: data}
      # Index the department
      begin
        GupAdminOrganisation.put_to_index document
      rescue RestClient::ExceptionWithResponse => e
        # Handle the error
        puts "Error indexing department #{id}: #{e.response}"
      end
    end
  end

  def self.index_all
    index_faculties
    index_departments
  end

  def self.faculty_id_mapping
    # Mapping of faculty ids to organisation ids
    {
      61 => {orgdbid: "OD-1-71", orgnr: "09"},
      63 => {orgdbid: "OD-1-64", orgnr: "08"},
      64 => {orgdbid: "OD-1-303", orgnr: "02"},
      65 => {orgdbid: "OD-1-221", orgnr: "01"},
      81 => {orgdbid: "OD-1-317", orgnr: "03"},
      102 => {orgdbid: "OD-1-73", orgnr: "04"},
      121 => {orgdbid: "OD-1-97", orgnr: "10"},
      122 => {orgdbid: "OD-1-229", orgnr: "05"},
      141 => {orgdbid: "OD-1-126", orgnr: "98"}, # ???
      142 => {orgdbid: "OD-1-221", orgnr: "01"},
      665 => {orgdbid: nil, orgnr: nil} # ??? No faculty affiliation
    }

  end
end
