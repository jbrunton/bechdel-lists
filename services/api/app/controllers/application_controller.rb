class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::Helpers

  NotAuthorized = Class.new(StandardError)
  NotAuthenticated = Class.new(StandardError)

  rescue_from ApplicationController::NotAuthorized do
    render status: 403
  end

  rescue_from ApplicationController::NotAuthenticated do
    render status: 401
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    render status: 422, json: {
        errors: e.record.errors.as_json,
        messages: e.record.errors.full_messages.as_json
    }
  end

  def authorize! action, subject
    raise NotAuthorized unless Authorizer.new(current_user).can?(action, subject)
  end

  def authenticate!
    raise NotAuthenticated if current_user.nil?
  end

  def current_user
    @current_user ||= User.find_by_id(session[:user_id])
  end

  def signed_in?
    !!current_user
  end

  helper_method :current_user, :signed_in?

  def current_user=(user)
    @current_user = user
    session[:user_id] = user&.id
  end
end
