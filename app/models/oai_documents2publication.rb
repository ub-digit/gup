class OaiDocuments2publication < ActiveRecord::Base
  belongs_to :publication
  belongs_to :oai_document
  belongs_to :oai_metadata_format
  belongs_to :oai_set

end
