class V1::ProjectsController < V1::V1Controller
  before_filter :validate_access, except: [:index]

  api :GET, '/projects', 'Returns a list of all available projects'
  def index
    @response[:projects] = Project.all
    render_json
  end

end
