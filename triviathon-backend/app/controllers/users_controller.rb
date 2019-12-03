class UsersController < ApplicationController
  def index
    users = User.all 
    render json: users
  end

  def show
    user = User.find_by(params[:id])
    render json: user
  end

  def create
    user = User.create(params[:username])
    render json: user
  end

  def create 
    # Find user in db or create new
    # set user variable = to this
    # render json for this user
  end

end
