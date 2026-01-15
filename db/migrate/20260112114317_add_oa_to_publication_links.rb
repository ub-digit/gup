class AddOaToPublicationLinks < ActiveRecord::Migration
  def change
    add_column :publication_links, :oa, :boolean: default: false
  end
end
