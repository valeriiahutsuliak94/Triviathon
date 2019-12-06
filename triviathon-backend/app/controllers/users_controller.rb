class UsersController < ApplicationController
  def index
    users = User.all 
    render json: users
  end

  def show
    user = User.find_by(id: params[:id])
    render json: user, include: :answers
  end

  def create
    user = User.find_or_create_by(username: params[:username])
    render json: user, include: :answers
  end
  
  def update
    user = User.find_by(id: params[:id])
    user.update(score: params[:score])
    render json: user, include: :answers
  end 

end
