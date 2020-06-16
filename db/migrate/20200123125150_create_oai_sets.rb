class CreateOaiSets < ActiveRecord::Migration
  def change
    create_table :oai_sets do |t|
      t.text :name
      t.timestamps
    end
  end
end
