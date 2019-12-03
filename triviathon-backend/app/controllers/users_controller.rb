class UsersController < ApplicationController
  def index
    users = User.all 
    render json: users
  end

  def show
    user = User.find_or_create_by()
    render json: user
  end

end
