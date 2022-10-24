class ArtworkType

  # Returns a list of all artwork_types
  def self.all
    artwork_types = []
    APP_CONFIG['artwork_types'].each do |artwork_type|
      artwork_types << {label: artwork_type[I18n.locale.to_s], value: artwork_type['code'].downcase}
    end
    return artwork_types
  end

  # Returns a single artwork_type object based on code
  def self.find_by_code(code)
    return nil if code.nil?
    artwork_type = APP_CONFIG['artwork_types'].find{|x| x['code'].downcase == code.downcase}
    if artwork_type.present?
      return {label: artwork_type[I18n.locale.to_s], value: artwork_type['code'].downcase}
    else
      return nil
    end
  end
end