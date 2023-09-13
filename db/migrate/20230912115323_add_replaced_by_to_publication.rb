class AddReplacedByToPublication < ActiveRecord::Migration
  def change
    add_column :publications, :replaced_by_publication_id, :integer
  end
end
