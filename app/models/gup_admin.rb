class GupAdmin
  def self.get_document publication_id
    id = publication_id.to_i
    row = ActiveRecord::Base.connection.exec_query("SELECT publication FROM v_publications where publication_id = #{id}").rows[0][0]
  end

  def self.get_documents opts
    sql = "SELECT publication FROM v_publications order by publication_id desc"
    sql = sql + " limit #{opts[:limit].to_i}" if opts[:limit]
    sql = sql + " offset #{opts[:offset].to_i}" if opts[:offset]

    rows = ActiveRecord::Base.connection.exec_query(sql).rows
  end
  def self.put_to_index publication_id
    should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings']['enable']
    return if should_abort
    document = GupAdmin.get_document publication_id
    RestClient.put "#{APP_CONFIG['gup_admin_settings']['base_url']}/publications/?api_key=#{APP_CONFIG['gup_admin_settings']['api_key']}", JSON.parse('{"data":' + document + '}').to_json ,  content_type: :json
  end

  def self.delete_from_index publication_id
    should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings']['enable']
    return if should_abort
    RestClient.delete "#{APP_CONFIG['gup_admin_settings']['base_url']}/publications/gup_#{publication_id}?api_key=#{APP_CONFIG['gup_admin_settings']['api_key']}"
  end

  def self.index_all opts = {}
    documents = GupAdmin.get_documents opts
    documents.each do |document|
      RestClient.put "#{APP_CONFIG['gup_admin_settings']['base_url']}/publications/?api_key=#{APP_CONFIG['gup_admin_settings']['api_key']}", JSON.parse('{"data":' + document[0] + '}').to_json ,  content_type: :json
    end
  end
end
