class User < ActiveRecord::Base
  has_secure_password # This adds a few methods
  # password getter and setter methods
  # Authenticate #=> user

end
