class RenameOaToIsOa < ActiveRecord::Migration
  def change
    rename_column :publication_links, :oa, :is_oa
  end
end
