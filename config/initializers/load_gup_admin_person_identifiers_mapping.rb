if ENV["GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING"].blank?
  raise "GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING environment variable is not set"
end
#Make a key value hash from the environment variable
GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING = ENV["GUP_ADMIN_PERSON_IDENTIFIERS_MAPPING"].split(",").map { |i| i.split(":") }.to_h

