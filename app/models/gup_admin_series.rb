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
	  raise "Full reindex does not support limit or offset" if opts[:limit] || opts[:offset]

	  settings = APP_CONFIG.fetch('gup_admin_settings')
	  base_url = settings.fetch('index_manager_base_url').sub(/\/+\z/, '')
	  api_key = settings.fetch('index_manager_api_key')

	  documents = get_documents({})

	  series = documents.flat_map do |document|
	    parsed = JSON.parse(document[1])
	    parsed = [parsed] unless parsed.is_a?(Array)

	    parsed.map do |serie|
	      serie["id"] = serie.delete("serie_id")
	      serie
	    end
	  end

	  raise "No series found - aborting reindex" if series.empty?
	  raise "Series without id - aborting reindex" if series.any? { |s| s["id"].nil? }

	  ids = series.map { |s| s["id"].to_s }
	  raise "Duplicate series IDs - aborting reindex" if ids.uniq.length != ids.length

	  puts "Sending #{series.length} series to GUP Admin..."

	  response = RestClient.put(
	    "#{base_url}/api/series",
	    { api_key: api_key, data: series }.to_json,
	    content_type: :json,
	    accept: :json
	  )

	  result = JSON.parse(response.body)

	  unless result["message"] == "Series indexed successfully"
	    raise "Series indexing failed: #{result.inspect}"
	  end

	  puts "Successfully indexed #{series.length} series."
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
