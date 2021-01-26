class AddPubmedIdToEndnoteRecord < ActiveRecord::Migration
  def change
    add_column :endnote_records, :pubmed_id, :text
  end
end
