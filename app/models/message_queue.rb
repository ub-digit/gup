require 'mods.rb'
class MessageQueue
  def self.send_update_to_queue publication
    return if !APP_CONFIG['mq_settings']['enable']
    document = OaiDocuments::MODS.create_complete_record publication
    begin
      RestClient.post "#{APP_CONFIG['mq_settings']['base_url']}?api_key=#{APP_CONFIG['mq_settings']['api_key']}", document
    rescue
      logger.warning "Error posting update document with publication id=#{publication.id} to MQ at host #{APP_CONFIG['mq_settings']['base_url']}"
    end
  end

  def self.send_delete_to_queue publication_id
    return if !APP_CONFIG['mq_settings']['enable']
    document = OaiDocuments::MODS.create_deleted_record publication_id
    begin
      RestClient.post "#{APP_CONFIG['mq_settings']['base_url']}?api_key=#{APP_CONFIG['mq_settings']['api_key']}", document
    rescue
      logger.warning "Error posting delete document with publication id=#{publication_id} to MQ at host #{APP_CONFIG['mq_settings']['base_url']}"
    end
  end
end