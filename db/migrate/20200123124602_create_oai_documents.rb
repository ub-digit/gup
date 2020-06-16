class CreateOaiDocuments < ActiveRecord::Migration
  def change
    create_table :oai_documents do |t|
      t.text :document
      t.timestamps    
    end
  end
end
