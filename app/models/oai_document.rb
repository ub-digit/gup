class OaiDocument < ActiveRecord::Base
  has_many :oai_documents2publications
  has_many :publications, :through => :oai_documents2publications

end
