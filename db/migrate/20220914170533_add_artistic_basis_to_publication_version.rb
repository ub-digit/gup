class AddArtisticBasisToPublicationVersion < ActiveRecord::Migration
  def change
    add_column :publication_versions, :artistic_basis, :boolean    
  end
end
