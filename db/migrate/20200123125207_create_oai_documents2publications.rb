class CreateOaiDocuments2publications < ActiveRecord::Migration
  def change
    create_table :oai_documents2publications do |t|
      t.integer :publication_id
      t.integer :oai_document_id
      t.integer :oai_metadata_format_id
      t.integer :oai_set_id
      t.timestamps
    end
  end
end
