class V1::OrganisationsController < V1::V1Controller
  before_filter :validate_access
  api :POST, '/organisations', 'Takes a list of organisations and saves them to the database'
  def update_batch
    organisations = params[:organisations]
    if organisations.nil?
      error_msg(ErrorCodes::VALIDATION_ERROR, "#{I18n.t "organisations.errors.no_organisations"}")
      render_json
      return
    end
    # Example organisation
    # {
    #   "hierarchy": [
    #     1,
    #     2
    #   ],
    #   "end_year": 2000,
    #   "id": 3,
    #   "name_en": "name",
    #   "name_sv": "namn",
    #   "orgdbid": "xxx",
    #   "orgnr": "yyyy",
    #   "staffnotes": "comment",
    #   "start_year": 2020,
    #   "is_internal": true
    # }

    # Get lists of exisiting ids for departments and faculties (assume there are no conflict between them)
    organisation_ids = Faculty.all.pluck(:id) + Department.all.pluck(:id)

    # Create all organisations
    # If the hierarchy is empty, the organisation is a faculty
    # If the hierarchy is not empty, the organisation is a department
    # If it is a department, and if there is exactly one element in the hierarchy, this element is the faculty id, and the departmen has no parent
    # If it is a department, and if there are more than one element in the hierarchy, the first element is the faculty id, and last element is the parent id
    # If the incoming id exists in organisation_ids, update the existing organisation
    # If the incoming id does not exist in organisation_ids, create a new organisation
    # The faculty model has attributes id, name_sv and name_en only
    # The department modea has all attributes above
    organisations.each do |organisation|
      # If the organisation is wrapped in an _source key, unwrap it
      if organisation[:_source]
        o = organisation
        organisation = o[:_source]
      end
      # Check if the organisation is a faculty or a department
      if organisation[:hierarchy].nil? || organisation[:hierarchy].empty?
        # Faculty
        # Check if the organisation id exists in the organisation_ids list
        # If it does, update the existing organisation
        # If it does not, create a new organisation
        faculty = Faculty.find_or_initialize_by(id: organisation[:id])

        faculty.name_sv = organisation[:name_sv]
        faculty.name_en = organisation[:name_en]
        faculty.save!
        pp faculty
      else
        # Department
        department = Department.find_or_initialize_by(id: organisation[:id])
        department.name_sv = organisation[:name_sv]
        department.name_en = organisation[:name_en]
        department.orgnr = organisation[:orgnr]
        department.orgdbid = organisation[:orgdbid]
        department.staffnotes = organisation[:staffnotes]
        department.start_year = organisation[:start_year]
        department.end_year = organisation[:end_year]
        department.is_internal = organisation[:is_internal]

        # Set the parent id
        if organisation[:hierarchy].length == 1
          # No parent, set the faculty id
          department.parentid = nil
          department.faculty_id = organisation[:hierarchy][0]
        else
          # Set the parent id and the faculty id
          department.parentid = organisation[:hierarchy][-1]
          department.faculty_id = organisation[:hierarchy][0]
        end
        department.save!
        pp department
      end
    end
    @response[:organisations] = {}
    render_json(200)
  end
end