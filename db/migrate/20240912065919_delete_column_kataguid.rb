class DeleteColumnKataguid < ActiveRecord::Migration
  def change
    remove_column :departments, :kataguid
  end
end
