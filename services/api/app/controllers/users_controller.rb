class UsersController < ApplicationController
  def profile
    render json: current_user.as_json
  end

  def update
    current_user.update!(params.require(:user).permit(:name))
    render json: @current_user.as_json
  end

  def show
    @user = User.find(params[:user_id])
    render json: { name: @user.name }
  end

  def lists
    @user = User.find(params[:user_id])
    @lists = @user.lists.where(public: true)
    render json: @lists.as_json
  end
end
