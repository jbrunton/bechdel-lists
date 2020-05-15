class User < ApplicationRecord
  def self.find_or_create_by_email(email, name)
    user = User.find_or_create_by(email: email)
    user.name = name unless name.nil?
    user.save!
    user
  end
end
