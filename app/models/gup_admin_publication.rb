class GupAdminPublication
  def self.get_document publication_id
    id = publication_id.to_i
    row = ActiveRecord::Base.connection.exec_query("SELECT publication FROM v_publications where publication_id = #{id}").rows[0][0]
  end

  def self.get_documents opts
    sql = "SELECT publication_id, publication FROM v_publications order by publication_id desc"
    sql = sql + " limit #{opts[:limit].to_i}" if opts[:limit]
    sql = sql + " offset #{opts[:offset].to_i}" if opts[:offset]

    rows = ActiveRecord::Base.connection.exec_query(sql).rows
  end
  def self.put_to_index publication_id
    should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings'].key?('publication') || !APP_CONFIG['gup_admin_settings']['publication']['enable']
    return if should_abort
    document = GupAdminPublication.get_document publication_id
    RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/publications/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + document + '}').to_json ,  content_type: :json
  end

  def self.delete_from_index publication_id
    should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings'].key?('publication') || !APP_CONFIG['gup_admin_settings']['publication']['enable']
    return if should_abort
    RestClient.delete "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/publications/gup_#{publication_id}?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}"
  end

  def self.index_all opts = {}
    documents = GupAdminPublication.get_documents opts
    documents.each_with_index do |document, index|
      puts "Index: #{index}, Publication id: #{document[0]}"
      RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/publications/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + document[1] + '}').to_json ,  content_type: :json
    end
  end

  def self.sync_updated opts
    days = opts[:days]
    sql = "SELECT publication_id, publication FROM v_publications WHERE publication_id IN (SELECT id from publications WHERE published_at IS NOT NULL AND deleted_at IS NULL AND updated_at > ?) ORDER BY publication_id DESC"
    sql_executable = ActiveRecord::Base.send(:sanitize_sql_array, [sql, days.days.ago])
    rows = ActiveRecord::Base.connection.exec_query(sql_executable).rows
    total = rows.count
    rows.each_with_index do |row, index|
      puts "Update: #{index} of #{total}, Publication id: #{row[0]}"
      RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/publications/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + row[1] + '}').to_json ,  content_type: :json
    end
  end

  def self.sync_deleted opts
    days = opts[:days]
    sql = "SELECT id from publications WHERE published_at IS NOT NULL AND deleted_at > ? ORDER BY id DESC"
    sql_executable = ActiveRecord::Base.send(:sanitize_sql_array, [sql, days.days.ago])
    rows = ActiveRecord::Base.connection.exec_query(sql_executable, [days.days.ago]).rows
    total = rows.count
    rows.each_with_index do |row, index|
      puts "Delete: #{index} of #{total}, Publication id: #{row[0]}"
      RestClient.delete "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/publications/gup_#{row[0]}?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}"
    end
  end

end
