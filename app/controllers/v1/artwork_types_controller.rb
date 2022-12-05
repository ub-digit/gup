class V1::ArtworkTypesController < V1::V1Controller
  api :GET, '/artwork_types', 'Returns a list of all type of works (for artistic works).'
  before_filter :validate_access, except: [:index]

  def index
    @response[:artwork_types] = ArtworkType.all
    render_json
  end
end

