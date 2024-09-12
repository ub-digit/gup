namespace :people do

  desc "Create list of new researchers without x-account in GUP"
  task :create_list_of_researchers => :environment do
    # uttag ur databasen
    start_date = Date.today.ago(1.month).beginning_of_month
    end_date = Date.today.beginning_of_month
    people = Person.all
      .where("created_at >= '#{start_date}'")
      .where("created_at < '#{end_date}'")
      .where("id NOT IN (SELECT person_id FROM identifiers WHERE source_id = 1)")
      .where("id IN (SELECT person_id FROM people2publications p2p JOIN departments2people2publications d2p2p ON d2p2p.people2publication_id=p2p.id WHERE d2p2p.department_id <> 666 AND d2p2p.department_id <> 667)")

    last_month = Time.now - 1.month
    last_month = last_month.month
    monthnames_swedish = ['', 'januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december']
    last_month_text = monthnames_swedish[last_month]

    current_year = Time.zone.now.year
    xl = Spreadsheet::Workbook.new
    sheet = xl.create_worksheet(name: "#{last_month_text}")
    sheet.row(0).push('id', 'year_of_birth', 'first_name', 'last_name', 'created_at', 'updated_at', 'created_by', 'updated_by', 'staffnotes', 'deleted_at')
    i = 0
    people.each do |p|
      i += 1
      sheet.row(i).push("#{p.id}")
      sheet.row(i).push("#{p.year_of_birth}")
      sheet.row(i).push("#{p.first_name}")
      sheet.row(i).push("#{p.last_name}")
      sheet.row(i).push("#{p.created_at}")
      sheet.row(i).push("#{p.updated_at}")
      sheet.row(i).push("#{p.created_by}")
      sheet.row(i).push("#{p.updated_by}")
      sheet.row(i).push("#{p.staffnotes}")
      sheet.row(i).push("#{p.deleted_at}")
    end
    xl.write "/tmp/researchers-#{current_year}-#{last_month_text}.xls"


  message = "meddelande"
  from = "#{APP_CONFIG['mail_settings']['from_email']}"
  to = "#{APP_CONFIG['mail_settings']['to_email']}"
  subject = "Nya forskare för #{last_month_text}"
  @from = from
  @to = to
  @message = message
  @subject = subject

    if PublicationMailer.new_researchers_email(year: current_year, month: last_month_text, from: from, to: to).deliver_now 
   #   #@response[:feedback_mail] = {}
   #   @response[:feedback_mail][:status] = "ok" 
   #   render_json
    else
   #   error_msg(ErrorCodes::OBJECT_ERROR, "Could not send email")
   #   render_json
    end



    begin
      f = File.open("/tmp/researchers-#{current_year}-#{last_month_text}.xls", 'r')
    ensure
      f.close unless f.nil? or f.closed?
      File.delete("/tmp/researchers-#{current_year}-#{last_month_text}.xls") if File.exists? "/tmp/researchers-#{current_year}-#{last_month_text}.xls"
    end

  end
end
