require 'mods.rb'
class MessageQueue
  def self.send_to_queue publication, action
    return if !APP_CONFIG['mq_settings']['enable']
    if action.eql?('update')
      document = OaiDocuments::MODS.create_complete_record publication
    elsif action.eql?('delete')
      document = OaiDocuments::MODS.create_delete_record publication.id
    else
      return
    end
    pp document
    begin
      RestClient.post "#{APP_CONFIG['mq_settings']['base_url']}?api_key=#{APP_CONFIG['mq_settings']['api_key']}", document
    rescue
    end
  end
end