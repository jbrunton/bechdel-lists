class User < ApplicationRecord
  has_many :lists
  validates_presence_of :name

  def public?
    self.lists.any?{ |list| list.public }
  end

  def self.find_or_create_by_email(email, name)
    user = User.find_or_create_by(email: email)
    user.name = name if user.name.nil?
    user.save!
    user
  end
end
