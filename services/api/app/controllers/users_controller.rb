class UsersController < ApplicationController
  before_action :set_user, only: [:show, :lists]

  def profile
    authenticate!
    render json: current_user.as_json
  end

  def update
    authenticate!
    current_user.update!(params.require(:user).permit(:name))
    render json: @current_user.as_json
  end

  def show
    authorize! :read, @user
    render json: { name: @user.name }
  end

  def lists
    authorize! :read, @user
    @lists = @user.lists.where(public: true)
    render json: @lists.as_json
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end
end
