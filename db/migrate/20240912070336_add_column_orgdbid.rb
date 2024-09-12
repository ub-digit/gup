class AddColumnOrgdbid < ActiveRecord::Migration
  def change
    add_column :departments, :orgdbid, :text
  end
end
