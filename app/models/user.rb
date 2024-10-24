class User < ActiveRecord::Base
  validates_presence_of :username
  validates_presence_of :first_name
  validates_presence_of :last_name
  validates_presence_of :role
  validate :role_valid
  validate :username_valid

  has_many :access_tokens

  # Validates that role exists in config file
  def role_valid
    if !role_data
      errors.add(:role, :invalid)
    end
  end

  # Extract role data from config
  def role_data
    APP_CONFIG['roles'].find { |role| role['name'] == self.role }
  end

  # If role is of type api, we say that it has a key
  def has_key?
    return false if !role_data
    role_data['type'] == 'api'
  end

  def has_right?(right_value)
    role_data["rights"].include? right_value
  end

  def username_valid
    if username && username[/^\d+$/]
      errors.add(:username, :no_numeric)
    end

    if username && !username[/^[a-zA-Z0-9]+$/]
      errors.add(:username, :alphanumeric)
    end
  end

  ### Can be removed
  # Auth override
  def auth_override_present?
    return APP_CONFIG['auth_override']
  end

  # Returns user ids if username has a valid identifier
  def person_ids
    persons = Person.find_all_from_identifier(source: 'xkonto', identifier: username)
    return nil if persons.blank?
    return persons.map(&:id)
  end

end
