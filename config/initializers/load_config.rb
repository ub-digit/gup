# Read config files and store applicable values in APP_CONFIG constant
main_config = YAML.load_file("#{Rails.root}/config/config.yml")
languages_config = YAML.load_file("#{Rails.root}/config/languages.yml")
publication_identifier_codes_config = YAML.load_file("#{Rails.root}/config/publication_identifier_codes.yml")

data_sources_config_file = Rails.env == 'test' ? 'config/data_sources_test.yml' : 'config/data_sources.yml'
data_sources_config = YAML.load_file("#{Rails.root}/#{data_sources_config_file}")

secret_config_file = Rails.env == 'test' ? 'config/config_secret.test.yml' : 'config/config_secret.yml'
require "erb"
require "yaml"
yaml = Pathname.new("#{Rails.root}/#{secret_config_file}")
secret_config = YAML.load(ERB.new(yaml.read).result(binding))

config = main_config
config = config.merge(secret_config)
config = config.merge(data_sources_config)
config = config.merge(languages_config)
config = config.merge(publication_identifier_codes_config)

APP_CONFIG = config
