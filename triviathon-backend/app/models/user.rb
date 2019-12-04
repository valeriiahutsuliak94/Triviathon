class User < ApplicationRecord
  has_many :answers
  # validates :username, uniqueness: true
end
