class CreateOaiMetadataFormats < ActiveRecord::Migration
  def change
    create_table :oai_metadata_formats do |t|
      t.text :name
      t.timestamps

    end
  end
end
