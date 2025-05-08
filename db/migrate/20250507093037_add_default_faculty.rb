class AddDefaultFaculty < ActiveRecord::Migration
  def change
    # Create a new row in the faculty table
    Faculty.create(
      id: 665, # Assume this is not used
      name_sv: 'Ingen fakultetstillhörighet',
      name_en: 'No faculty affiliation'
    )
  end
end
