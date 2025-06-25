class V1::PublicationTypesController < ApplicationController
  
  api :GET, '/publication_types', 'Returns a list of all configurated publication types'
  def index
    publication_types = Rails.cache.fetch('publication_types', expires_in: 14.days) do
      PublicationType.all.as_json
    end
    @response[:publication_types] = publication_types
    render_json
  end

  api :GET, '/publication_types/:id', 'Returns a single publication type based on the publication type id'
  def show
    publication_type = PublicationType.find_by_id(params[:id])
    if publication_type.present?
      @response[:publication_type] = publication_type
    else
      error_msg(ErrorCodes::OBJECT_ERROR, "#{I18n.t "publication_types.errors.not_found"}: #{params[:id]}")
    end
    render_json
  end
end
