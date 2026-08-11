class V1::PeopleController < V1::V1Controller

  api :GET, '/people', 'Not implemented. PersonRecordsController index should be used'
  def index
    render_json(501)
  end

  api :GET, '/people/:id', 'Returns a single person object'
  def show
    personid = params[:id]
    person = Person.find_by_id(personid)
    if person.present?
      @response[:person] = person
    else
      error_msg(ErrorCodes::OBJECT_ERROR, "#{I18n.t "people.errors.not_found"}: #{params[:id]}")
    end
    render_json
  end

  api :POST, '/people', 'Creates a person object including identifiers if they exist'
  def create
    # Creating a new person will always be done trough GUP Admin

    # Get first name and last name and orcid from params
    first_name = params[:person][:first_name]
    last_name = params[:person][:last_name]

    if first_name.blank? || last_name.blank?
      error_msg(ErrorCodes::VALIDATION_ERROR, "#{I18n.t "people.errors.create_error"}: #{params[:id]}", "First name and last name are required")
      render_json
      return
    end

    orcid = params[:person][:orcid]

    # The id will be created from the GUP Admin
    request_person_hash = {names: [{first_name: first_name, last_name: last_name, gup_person_id: nil}]}
    if orcid.present?
      request_person_hash[:identifiers] = [{code: 'ORCID', value: orcid}]
    end

    begin
      result = GupAdminPerson.put_to_index(request_person_hash)
      pp result
      pp result.code
      pp result.body

      # Check result from GUP Admin, result should be 200 och 201 and body should be of type json
      if result.code != 200 && result.code != 201
        error_msg(ErrorCodes::VALIDATION_ERROR, "#{I18n.t "people.errors.create_error"}: #{params[:id]}", "Error creating person in GUP Admin: #{result.body}")
        render_json
        return
      end

      # Get person data

      body = JSON.parse(result.body)
      # Get the primary name
      primary_name = body['data']['names'].find { |name| name['primary'] }
      # Check that primary_name is not nil TBD

      # Create respone hash for presentation in the frontend
      id = primary_name['gup_person_id']
      first_name = primary_name['first_name']
      last_name = primary_name['last_name']
      year_of_birth = body['data']['year_of_birth']
      created_at = body['data']['created_at']
      updated_at = body['data']['updated_at']
      identifiers = body['data']['identifiers'].map { |identifier| {source_name: GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING[identifier['code']], value: identifier['value']} }
      presentation_string = "#{first_name} #{last_name}"
      if identifiers.any?
        presentation_string += " (#{identifiers.map { |i| "#{i[:value]}" }.join(', ')})"
      end
    rescue => e
      error_msg(ErrorCodes::VALIDATION_ERROR, "#{I18n.t "people.errors.create_error"}: #{params[:id]}", "Error creating person in GUP Admin: #{e.message}")
      render_json
      return
    end

    response_person_hash = {id: id, year_of_birth: year_of_birth, first_name: first_name, last_name: last_name, created_at: created_at, updated_at: updated_at, identifiers: identifiers, alternative_names: [], presentation_string: presentation_string}
    @response[:person] = response_person_hash
    render_json(201)
  end

  api :PUT, '/people/:id', 'Updates a specific person object.'
  def update
    person_id = params[:id]
    person = Person.find_by_id(person_id)

    # If person is not found, create a new person object with the given id, this is called from Gup Admin
    # NOTE: This assumes that the id is reserved in advance by using the get_next_id endpoint before calling this endpoint
    if person.nil?
      # To aviod sequence out of sync, we need to make a  check that the id is below the current sequence value
      max_id = ActiveRecord::Base.connection.execute("SELECT last_value FROM people_id_seq").first['last_value']
      if person_id.to_i > max_id.to_i
        error_msg(ErrorCodes::VALIDATION_ERROR, "#{I18n.t "people.errors.update_error"}: #{params[:id]}", "Person id is out of sync with sequence")
        render_json
        return
      end
      person = Person.new({id: person_id})
    end

    puts "*************************************************"
    pp person
    puts "*************************************************"
    pp params[:person]
    puts "*************************************************"

    # Avoid unnecessary publication index updates
    update_publication_index = update_publication_index?(person, params[:person])

    if person.update_attributes(permitted_params)
      if person.present?
        if params[:person] && params[:person][:identifiers]
          # Make this in a transaction
          ActiveRecord::Base.transaction do
            # Remove all identifiers for this person
            person.identifiers.each do |identifier|
              identifier.destroy
            end
            # Create new identifiers from params
            params[:person][:identifiers].each do |identifier|
              # Identifiers are delivered as a hash with code as key and value as value
              # Code must me translated by the mapping in GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING before use it i GUP
              gup_admin_code = identifier[:code]
              code = GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING[gup_admin_code]
              value = identifier[:value]
              if code && value.present?
                source = Source.find_by_name(code)
                if source
                  person.identifiers.create(source_id: source.id, value: value)
                end
              end
            end
          end
        # This block can be deleted when the person admin page in frontend is removed
        else
          if params[:person] && params[:person][:xaccount]
            xaccount_source = Source.find_by_name("xkonto")

            # Find any identifier of type "xkonto"
            old_xaccount = person.identifiers.find { |i| i.source_id == xaccount_source.id }
            if old_xaccount
              if params[:person][:xaccount].present?
                old_xaccount.update_attribute(:value, params[:person][:xaccount])
              else
                old_xaccount.destroy
              end
            else
              person.identifiers.create(source_id: xaccount_source.id, value: params[:person][:xaccount])
            end
          end

          if params[:person] && params[:person][:orcid]
            orcid_source = Source.find_by_name("orcid")

            # Find any identifier of type "orcid"
            old_orcid = person.identifiers.find { |i| i.source_id == orcid_source.id }
            if old_orcid
              if params[:person][:orcid].present?
                old_orcid.update_attribute(:value, params[:person][:orcid])
              else
                old_orcid.destroy
              end
            else
              person.identifiers.create(source_id: orcid_source.id, value: params[:person][:orcid])
            end
          end
        end

        # Reload object before update search engine
        person.reload
        if update_publication_index
          puts "Person attributes changed, update publication index "
          PublicationSearchEngine.update_search_engine_for_publication_list(person.publications.published.non_deleted)
        else
          puts "Person attributes unchanged, skip publication index update"
        end

        @response[:person] = person
        render_json
      else
        error_msg(ErrorCodes::VALIDATION_ERROR, "#{I18n.t "people.errors.update_error"}: #{params[:id]}", person.errors)
        render_json
      end
    else
      error_msg(ErrorCodes::OBJECT_ERROR, "#{I18n.t "people.errors.not_found"}: #{params[:id]}")
      render_json
    end
  end

  api :DELETE, '/people/:id', 'Deletes a specific person object.'
  def destroy
    person = Person.find_by_id(params[:id])

    if person.present?
      if !person.has_active_publications?
        person.update_attributes(deleted_at: DateTime.now)
        @response[:person] = person.as_json
        PeopleSearchEngine.delete_from_search_engine(person.id)
      else
        # Deleting a person who has active publications would be bad.
        # This is not allowed.
        error_msg(ErrorCodes::VALIDATION_ERROR, "#{I18n.t "people.errors.delete_error"}: #{params[:id]}")
      end
      render_json
    else
      error_msg(ErrorCodes::OBJECT_ERROR, "#{I18n.t "people.errors.not_found"}: #{params[:id]}")
      render_json
    end
  end

  # People affiliated with GU but without x-account
  def researchers_without_xaccount()
    last_month = Time.now - 1.month
    #People.
  end

  api :GET, '/people/:id', 'Returns a single person object'
  def show
    personid = params[:id]
    person = Person.find_by_id(personid)
    if person.present?
      @response[:person] = person
    else
      error_msg(ErrorCodes::OBJECT_ERROR, "#{I18n.t "people.errors.not_found"}: #{params[:id]}")
    end
    render_json
  end

  api :GET, '/people/get_next_id', 'Returns a new person id using nextval from the sequence people_id_seq'
  def get_next_id
    # Get the next available id by using the sequence
    next_id = ActiveRecord::Base.connection.execute("SELECT nextval('people_id_seq')").first['nextval']
    @response[:id] = next_id
    render_json
  end

  def update_publication_index?(existing_person, incoming_person)
    # Update search engine only if any of the following attributes differ
    # - first_name
    # - last_name
    # - xkonto identifier
    # - orcid identifier

    incoming_xkonto = nil
    incoming_orcid = nil
    incoming_identifiers = incoming_person["identifiers"]
    if incoming_identifiers.present?
      incoming_xkonto = incoming_identifiers.find { |id| GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING[id["code"]] == "xkonto" }&.dig("value")
      incoming_orcid = incoming_identifiers.find { |id| GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING[id["code"]] == "orcid" }&.dig("value")
    end

    return true if existing_person.first_name.blank? && incoming_person["first_name"].present?
    return true if existing_person.first_name.present? && incoming_person["first_name"].blank?
    return true if existing_person.first_name != incoming_person["first_name"]
    return true if existing_person.last_name.blank? && incoming_person["last_name"].present?
    return true if existing_person.last_name.present? && incoming_person["last_name"].blank?
    return true if existing_person.last_name != incoming_person["last_name"]
    return true if existing_person.get_identifier(source: 'xkonto').blank? && incoming_xkonto.present?
    return true if existing_person.get_identifier(source: 'xkonto').present? && incoming_xkonto.blank?
    return true if existing_person.get_identifier(source: 'xkonto') != incoming_xkonto
    return true if existing_person.get_identifier(source: 'orcid').blank? && incoming_orcid.present?
    return true if existing_person.get_identifier(source: 'orcid').present? && incoming_orcid.blank?
    return true if existing_person.get_identifier(source: 'orcid') != incoming_orcid

    # No changes that require an update to the search engine
    return false
  end

  private

  def permitted_params
    params.require(:person).permit(:first_name, :last_name, :year_of_birth, :identifiers, :alternative_names)
  end

  # Returns a list of departments that given person id has a relation to
  def affiliations_for_actor(person_id:)
    publication_ids = Publication.where.not(published_at: nil).where(is_deleted: false).map {|publ| publ.id}
    people2publication_ids = People2publication.where('publication_id in (?)', publication_ids).where('person_id = (?)', person_id.to_i).map { |p| p.id}
    department_ids = Departments2people2publication.where('people2publication_id in (?)', people2publication_ids).order(updated_at: :desc).map {|d2p2p| d2p2p.department_id}
    departments = Department.where(id: department_ids)
    affiliations = departments.map {|d| {id: d.id, name: I18n.locale == :en ? d.name_en : d.name_sv}}
    return affiliations.sort_by {|a| a[:name]}
  end
end
