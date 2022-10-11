class V1::ArtworkTypesController < V1::V1Controller
  api :GET, '/artwork_types', 'Returns a list of all type of works (for artistic works).'
  def index
    types =
    [
      "Concert, performances, workshops",
      "Published music, sound art",
      "Film, video, radio",
      "Exhibitions, events festivals",
      "Physical artifacts",
      "Digital artifacts",
      "Konsert, framträdanden, workshops",
      "Publicerad musik och ljudkonst",
      "Film, video och radio",
      "Utställningar, events och festivaler",
      "Fysiska artefakter",
      "Digitala artefakter"
    ]
    @response[:artwork_types] = types.map{|type| {label: type, value: type}}
    render_json
  end
end