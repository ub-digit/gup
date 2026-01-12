class AddHasOaToPublicationTypes < ActiveRecord::Migration
  def change
    add_column :publication_types, :has_open_access, :boolean, default: true
  end
end
