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

  def self.put_to_index person_id
    should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings'].key?('person') || !APP_CONFIG['gup_admin_settings']['person']['enable']
    return if should_abort
    document = GupAdminPerson.get_document person_id
    RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/persons/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + document + '}').to_json ,  content_type: :json
  end

  def self.delete_from_index person_id
    # Not implemented
  end

  def self.index_all opts = {}
    documents = GupAdminPerson.get_documents opts
    documents.each_with_index do |document, index|
      puts "Index: #{index}, Person id: #{document[0]}"
      RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/persons/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + document[1] + '}').to_json ,  content_type: :json
    end
  end

  def self.search query
    response = RestClient.get "#{APP_CONFIG['gup_admin_settings']['backend_base_url']}/api/persons?query=#{query}&api_key=#{APP_CONFIG['gup_admin_settings']['backend_api_key']}"
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

  def self.get_department_data departments
    # Get a list of org db ids
    org_db_ids = departments.map { |department| department['orgdb_id'] }
    pp org_db_ids
    puts "org_db_ids" + org_db_ids.to_s
    departments_id = []
    departments_name_sv = []
    departments_name_en = []
    departments_start_year = []
    departments_end_year = []
    Department.where(orgdbid: org_db_ids.uniq).compact.each do |department|
      puts department.name_sv
      puts department.end_year
      departments_id << department.id
      departments_name_sv << department.name_sv
      departments_name_en << department.name_en
      departments_start_year << department.start_year
      departments_end_year << (department.end_year.nil? ? -1 : department.end_year)
    end
    return {departments_id: departments_id, departments_name_sv: departments_name_sv, departments_name_en: departments_name_en, departments_start_year: departments_start_year, departments_end_year: departments_end_year}
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
