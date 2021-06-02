class V1::SeriesController < V1::V1Controller
  before_filter :validate_access, except: [:index]
  api :GET, '/series', 'Returns a list of all available series'
  def index
    @response[:series] = Serie.all
    render_json
  end

end
