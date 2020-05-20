class UsersController < ApplicationController
  def profile
    render json: current_user.as_json
  end

  def update
    current_user.update!(params.require(:user).permit(:name))
    render json: @current_user.as_json
  end
end
