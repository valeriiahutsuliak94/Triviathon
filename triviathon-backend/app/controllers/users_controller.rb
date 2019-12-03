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
    user = User.create(username: params[:username])
    render json: user
  end


end
