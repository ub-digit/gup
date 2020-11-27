require "erb"
require "yaml"

# Read config files and store applicable values in APP_CONFIG constant
main_config = YAML.load_file("#{Rails.root}/config/config.yml")
data_sources_config = YAML.load_file("#{Rails.root}/config/data_sources.yml")
languages_config = YAML.load_file("#{Rails.root}/config/languages.yml")
publication_identifier_codes_config = YAML.load_file("#{Rails.root}/config/publication_identifier_codes.yml")
if Rails.env == 'test'
  secret_config = YAML.load_file("#{Rails.root}/config/config_secret.test.yml")
  data_sources_config = YAML.load_file("#{Rails.root}/config/data_sources_test.yml")
else
  # TODO: Hack, enable erb for all configs or set in config.rb?
  template = ERB.new File.new("#{Rails.root}/config/config_secret.yml")
  secret_config = YAML.load template.result
end

config = main_config
config = config.merge(secret_config)
config = config.merge(data_sources_config)
config = config.merge(languages_config)
config = config.merge(publication_identifier_codes_config)

APP_CONFIG = config
