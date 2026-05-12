class AddOaFieldsToPublicationLinks < ActiveRecord::Migration
  def change
    add_column :publication_links, :checked_at, :datetime
    add_index :publication_links, :checked_at
  end
end
