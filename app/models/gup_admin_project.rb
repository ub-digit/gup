class GupAdminProject

    def self.get_document project_id
        # Code to get the document goes here
        id = project_id.to_i
        row = ActiveRecord::Base.connection.exec_query("SELECT projects FROM v_publications where project_id = #{id}").rows[0][0]
    end

    def self.get_documents opts
        # Code to get multiple documents goes here
        sql = "SELECT project_id, project FROM v_projects order by project_id desc"
        sql = sql + " limit #{opts[:limit].to_i}" if opts[:limit]
        sql = sql + " offset #{opts[:offset].to_i}" if opts[:offset]

        rows = ActiveRecord::Base.connection.exec_query(sql).rows

    end

    def self.put_to_index project_id
        should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings'].key?('publication') || !APP_CONFIG['gup_admin_settings']['publication']['enable']
        return if should_abort
        document = GupAdminProject.get_document project_id
        RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/projects/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + document + '}').to_json ,  content_type: :json
    end

    def self.delete_from_index project_id
        should_abort = !APP_CONFIG.key?('gup_admin_settings') || !APP_CONFIG['gup_admin_settings'].key?('publication') || !APP_CONFIG['gup_admin_settings']['publication']['enable']
        return if should_abort
        RestClient.delete "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/projects/gup_#{project_id}?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}"
    end


    def self.index_all opts = {}
      documents = GupAdminProject.get_documents opts
    
      documents.each_with_index do |document, index|
        puts "Index: #{index}, Project id: #{document[0]}"
    
        projects = JSON.parse(document[1])
    
        projects.each do |project|
          project["id"] = project.delete("project_id")
        
          RestClient.put(
            "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/projects/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}",
            { data: project }.to_json,
            content_type: :json
          )
        end
      end
    end

    def self.sync_updated opts
        days = opts[:days]
        sql = "SELECT publication_id, publication FROM v_publications_v_projects WHERE publication_id IN (SELECT id from publications WHERE published_at IS NOT NULL AND deleted_at IS NULL AND updated_at > ?) ORDER BY publication_id DESC"
        sql_executable = ActiveRecord::Base.send(:sanitize_sql_array, [sql, days.days.ago])
        rows = ActiveRecord::Base.connection.exec_query(sql_executable).rows
        total = rows.count
        rows.each_with_index do |row, index|
            puts "Update: #{index} of #{total}, Project id: #{row[0]}"
            RestClient.put "#{APP_CONFIG['gup_admin_settings']['index_manager_base_url']}/projects/?api_key=#{APP_CONFIG['gup_admin_settings']['index_manager_api_key']}", JSON.parse('{"data":' + row[1] + '}').to_json ,  content_type: :json
        end
    end

end