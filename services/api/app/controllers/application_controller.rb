class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::Helpers

  def current_user
    @current_user ||= User.find_by_id(session[:user_id])
  end

  def signed_in?
    !!current_user
  end

  def authenticate_user!
    if current_user.nil?
      format.json { head :unauthorized }
    end
  end

  helper_method :current_user, :signed_in?, :authenticate_user!

  def current_user=(user)
    @current_user = user
    session[:user_id] = user&.id
  end
end
