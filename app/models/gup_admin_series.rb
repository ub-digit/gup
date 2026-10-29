class GupAdminSeries

    def self.get_document series_id
        # Code to get the document goes here
        id = series_id.to_i
        row = ActiveRecord::Base.connection.exec_query("SELECT series FROM v_publications where series_id = #{id}").rows[0][0]
    end

#    def self.get_documents opts
#        # Code to get multiple documents goes here
#        sql = "SELECT series_id, serie FROM v_series order by series_id desc"
#        sql = sql + " limit #{opts[:limit].to_i}" if opts[:limit]
#        sql = sql + " offset #{opts[:offset].to_i}" if opts[:offset]
#
#        rows = ActiveRecord::Base.connection.exec_query(sql).rows
#
#    end

    def self.get_documents opts = {}
      sql = "SELECT serie_id, serie FROM v_series ORDER BY serie_id DESC"
      sql += " LIMIT #{opts[:limit].to_i}" if opts[:limit]
      sql += " OFFSET #{opts[:offset].to_i}" if opts[:offset]

      ActiveRecord::Base.connection.exec_query(sql).rows
    end

    def self.put_to_index series_id
        should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings'].key?('publication') || !APP_CONFIG['gup_admin_settings']['publication']['enable']
        return if should_abort
        document = GupAdminSeries.get_document series_id
        RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/series/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + document + '}').to_json ,  content_type: :json
    end

    def self.delete_from_index series_id
        should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings'].key?('publication') || !APP_CONFIG['gup_admin_settings']['publication']['enable']
        return if should_abort
        RestClient.delete "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/series/gup_#{series_id}?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}"
    end

    
#    def self.index_all opts = {}
#      documents = GupAdminSeries.get_documents opts
#    
#      documents.each_with_index do |document, index|
#        puts "Index: #{index}, Series id: #{document[0]}"
#    
#        series_list = JSON.parse(document[1])
#    
#        series_list.each do |series|
#          series["id"] = series.delete("series_id")
#        
#          RestClient.put(
#            "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/series/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}",
#            { data: series }.to_json,
#            content_type: :json
#          )
#        end
#      end
#    end


    def self.index_all(opts = {})
      documents = get_documents(opts)
    
      documents.each_with_index do |document, index|
        serie_id, json = document
    
        series_list = JSON.parse(json)
        series_list = [series_list] unless series_list.is_a?(Array)
    
        series_list.each do |series|
          series["id"] = series.delete("serie_id")
        
          raise "Missing series id" if series["id"].nil?
        
          puts "Index: #{index}, Series id: #{series['id']}"
        
          response = RestClient.put(
            "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/series/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}",
            { data: series }.to_json,
            content_type: :json
          )
        
          result = JSON.parse(response.body)
        
          if result["error"] || result["status"] != "ok"
            raise "Failed to index series #{series['id']}: #{result.inspect}"
          end
        end
      end
    end

   def self.sync_updated opts
        days = opts[:days]
        sql = "SELECT publication_id, series FROM v_publications_v_series WHERE publication_id IN (SELECT id from publications WHERE published_at IS NOT NULL AND deleted_at IS NULL AND updated_at > ?) ORDER BY publication_id DESC"
        sql_executable = ActiveRecord::Base.send(:sanitize_sql_array, [sql, days.days.ago])
        rows = ActiveRecord::Base.connection.exec_query(sql_executable).rows
        total = rows.count
        rows.each_with_index do |row, index|
            puts "Update: #{index} of #{total}, Series id: #{row[0]}"
            RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/series/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + row[1] + '}').to_json ,  content_type: :json
        end
    end

end