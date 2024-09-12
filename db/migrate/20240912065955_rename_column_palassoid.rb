class RenameColumnPalassoid < ActiveRecord::Migration
  def change
    rename_column :departments, :palassoid, :orgnr
  end
end
