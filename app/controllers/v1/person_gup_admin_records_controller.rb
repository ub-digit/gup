class V1::PersonGupAdminRecordsController < ApplicationController


  def index
    search_term = params[:search_term]
    ignore_affiliation = params[:ignore_affiliation]

    # consider person as affiliated if it has affiliations or xaccount or orcid
    affiliation_term = (ignore_affiliation ? "has_affiliations:*" : "(has_affiliations:true OR xaccount:* OR orcid:*)")

    # Perform GUP Admin search
    result = GupAdminPerson.search(search_term)
    @response[:person_gup_admin_records] = result
    render_json
  end
end
