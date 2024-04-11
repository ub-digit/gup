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
    RestClient.put "#{APP_CONFIG['gup_admin_settings']['base_url']}/persons/?api_key=#{APP_CONFIG['gup_admin_settings']['api_key']}", JSON.parse('{"data":' + document + '}').to_json ,  content_type: :json
  end

  def self.delete_from_index person_id
    # Not implemented
  end

  def self.index_all opts = {}
    documents = GupAdminPerson.get_documents opts
    documents.each_with_index do |document, index|
      puts "Index: #{index}, Person id: #{document[0]}"
      RestClient.put "#{APP_CONFIG['gup_admin_settings']['base_url']}/persons/?api_key=#{APP_CONFIG['gup_admin_settings']['api_key']}", JSON.parse('{"data":' + document[1] + '}').to_json ,  content_type: :json
    end
  end
end
