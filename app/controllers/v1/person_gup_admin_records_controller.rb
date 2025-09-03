class V1::PersonGupAdminRecordsController < ApplicationController


  def index
    search_term = params[:search_term]
    gup_person_ids = params[:gup_person_ids]
    ignore_affiliation = params[:ignore_affiliation]

    # consider person as affiliated if it has affiliations or xaccount or orcid
    # TODO: Does not seem to be used?
    affiliation_term = (ignore_affiliation ? "has_affiliations:*" : "(has_affiliations:true OR xaccount:* OR orcid:*)")

    # Perform GUP Admin search

    result = if gup_person_ids then GupAdminPerson.search_gup_person_ids(gup_person_ids) else GupAdminPerson.search(search_term) end
    @response[:person_gup_admin_records] = result
    render_json
  end
end
