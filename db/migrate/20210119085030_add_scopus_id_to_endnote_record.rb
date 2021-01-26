class AddScopusIdToEndnoteRecord < ActiveRecord::Migration
  def change
    add_column :endnote_records, :scopus_id, :text  	
  end
end
