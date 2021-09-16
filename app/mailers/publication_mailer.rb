class PublicationMailer < ActionMailer::Base
  default from: APP_CONFIG['mail_settings']['from_email']
  default to: APP_CONFIG['mail_settings']['to_email']

  def feedback_email(from:, publication_id:, message:)
    @message = message
    @from = from
    @publication_id = publication_id
    subject = "GUP- Meddelande om pubid: #{publication_id}"
    delivery_options = {address: APP_CONFIG['mail_settings']['delivery_options']['address'],
                        port: APP_CONFIG['mail_settings']['delivery_options']['port'],
                        enable_starttls_auto: APP_CONFIG['mail_settings']['delivery_options']['enable_starttls_auto'],
                        user_name: APP_CONFIG['mail_settings']['delivery_options']['user_name'],
                        password: APP_CONFIG['mail_settings']['delivery_options']['password'],
                        authentication: APP_CONFIG['mail_settings']['delivery_options']['authentication']}

    mail(subject: subject,
          delivery_method_options: delivery_options
        )
  end

  def new_researchers_email(year:, month:, from:, to:)
     @from = from
     @to = to
     @year = year
     @month = month
     subject = "Nya forskare för #{month}"
     message = "Här kommer nya forskare i GUP som är knutna till en GU-institution men inte har något x-konto."
     attachments["researchers-#{year}-#{month}.xls"] = File.read("/tmp/researchers-#{year}-#{month}.xls")
     delivery_options = {
       address: APP_CONFIG['mail_settings']['delivery_options']['address'], 
       port: APP_CONFIG['mail_settings']['delivery_options']['port'],  
       enable_starttls_auto: APP_CONFIG['mail_settings']['delivery_options']['enable_starttls_auto'],
       user_name: APP_CONFIG['mail_settings']['delivery_options']['user_name'],  
       password: APP_CONFIG['mail_settings']['delivery_options']['password'],  
       authentication: APP_CONFIG['mail_settings']['delivery_options']['authentication'], 
     }
     mail(subject: subject,
          delivery_method_options: delivery_options
         )

  end
end
