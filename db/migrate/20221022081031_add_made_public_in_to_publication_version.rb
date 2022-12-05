class AddMadePublicInToPublicationVersion < ActiveRecord::Migration
  def change
    add_column :publication_versions, :made_public_in, :text
  end
end
