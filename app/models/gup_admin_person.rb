class GupAdminPerson
  def self.get_document person_id
    id = person_id.to_i
    row = ActiveRecord::Base.connection.exec_query("SELECT person FROM v_people where person_id = #{id}").rows[0][0]
  end

  def self.get_documents opts
    sql = "SELECT person_id, person FROM v_people where deleted_at is null order by person_id asc"
    sql = sql + " limit #{opts[:limit].to_i}" if opts[:limit]
    sql = sql + " offset #{opts[:offset].to_i}" if opts[:offset]

    rows = ActiveRecord::Base.connection.exec_query(sql).rows
  end

  def self.put_to_index person
    pp person
    should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings'].key?('person') || !APP_CONFIG['gup_admin_settings']['person']['enable']
    return if should_abort
    # If person is of type integer, get the document from the database json view
    if person.is_a?(Integer)
      document = GupAdminPerson.get_document person
    else
      # If person is a hash, use it as the document
      document = person.to_json
    end
    respose = RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/persons/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + document + '}').to_json ,  content_type: :json
    return respose
  end

  def self.delete_from_index person_id
    # Not implemented
  end

  def self.index_all opts = {}
    documents = GupAdminPerson.get_documents opts
    documents.each_with_index do |document, index|
      puts "Index: #{index}, Person id: #{document[0]}"
      RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/persons/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}&initial_load=true", JSON.parse('{"data":' + document[1] + '}').to_json ,  content_type: :json
    end
  end

  def self.search query
    encoded_query = URI.encode(query) # encode the query
    response = RestClient.get "#{APP_CONFIG['gup_admin_settings']['backend_base_url']}/api/persons?query=#{encoded_query}&api_key=#{APP_CONFIG['gup_admin_settings']['backend_api_key']}"
    if response.code != 200
      # TBD More error handling
      return nil
    end
    result = transform_search_result response.body
    return result
  end

  def self.transform_search_result data
    authors = JSON.parse(data)

    result = []
    authors['data'].each do |author|
      department_data = get_department_data(author['departments'])
      person_data = get_primary_person_data(author['names'])
      has_active_publications = true # ?
      has_affiliations = true, # ?
      created_at = author['created_at']
      updated_at = author['updated_at']
      year_of_birth = author['year_of_birth']
      orcid = get_orcid(author['identifiers'])
      xaccount = get_xaccount(author['identifiers'])
      identifiers = [orcid, xaccount].compact
      result << person_data.merge(department_data).merge({has_active_publications: true, has_affiliations: true, created_at: created_at, updated_at: updated_at, year_of_birth: year_of_birth, orcid: orcid, xaccount: xaccount, identifiers: identifiers}).compact
    end
    return result
  end

  def self.get_department_data person_departments
    departments_hash = {}
    org_db_ids = person_departments.map { |d| d['orgdb_id'] }.compact
    if org_db_ids.empty? 
      return {departments_id: [], departments_name_sv: [], departments_name_en: [], departments_start_year: [], departments_end_year: [], departments_presentation_name_sv: [], departments_presentation_name_en: []}
    end
    # Get the departments from the database,
    # if there are multiple rows for the orgdbid,
    # the one with the latest end_year shall override the others
    # If there is no end year for a department, consider it as the latest
    Department.where(orgdbid: org_db_ids).order("COALESCE(end_year, '9999') asc").each do |department|
      departments_hash[department.orgdbid] = department
    end
    person_departments_sorted = person_departments.map do |person_department|
      if departments_hash[person_department['orgdb_id']]
        department = departments_hash[person_department['orgdb_id']]
        {department_id: department.id,
         department_name_sv: department.name_sv,
         department_name_en: department.name_en,
         department_start_year: department.start_year, 
         department_end_year: department.end_year,
         person_department_enddate: person_department['end_date'].nil? ? "9999-12-31" : person_department['end_date'],
         department_presentation_name_sv: self.presentation_name(department.name_sv, person_department['start_date'], person_department['end_date']),
         department_presentation_name_en: self.presentation_name(department.name_en, person_department['start_date'], person_department['end_date'])
        }
      else
        nil
      end
    end.compact.sort_by { |d| d[:person_department_enddate] }.reverse

    departments_id = []
    departments_name_sv = []
    departments_name_en = []
    departments_start_year = []
    departments_end_year = []
    departments_presentation_name_sv = []
    departments_presentation_name_en = []
    person_departments_sorted.map do |department|
      departments_id << department[:department_id]
      departments_name_sv << department[:department_name_sv]
      departments_name_en << department[:department_name_en]
      departments_start_year << department[:department_start_year]
      departments_end_year << department[:department_end_year]
      departments_presentation_name_sv << department[:department_presentation_name_sv]
      departments_presentation_name_en << department[:department_presentation_name_en]
    end
    return {departments_id: departments_id, departments_name_sv: departments_name_sv, departments_name_en: departments_name_en, departments_start_year: departments_start_year, departments_end_year: departments_end_year, departments_presentation_name_sv: departments_presentation_name_sv, departments_presentation_name_en: departments_presentation_name_en}
  end

  def self.presentation_name(name, start_date, end_date)
    if start_date.nil? && end_date.nil?
      return name
    end
    if !start_date.nil? && end_date.nil?
      return "#{name} (#{start_date} - )"
    end
    if start_date.nil? && !end_date.nil?
      return "#{name} (- #{end_date})"
    end
    return "#{name} (#{start_date} - #{end_date})"
  end

  def self.get_primary_person_data names
    # if multiple entries, get the primary one
    names.each do |name|
      primary_name = name if name['primary']
    end
    # if no primary, return the first one
    primary_name = names[0]
    return {first_name: primary_name['first_name'], last_name: primary_name['last_name'], full_name: primary_name['full_name'], id: primary_name['gup_person_id']}
  end

  def self.get_orcid identifiers
    identifiers.each do |identifier|
      return identifier['value'] if identifier['code'] == 'ORCID'
    end
    return nil
  end

  def self.get_xaccount identifiers
    identifiers.each do |identifier|
      return identifier['value'] if identifier['code'] == 'X_ACCOUNT'
    end
    return nil
  end
end
