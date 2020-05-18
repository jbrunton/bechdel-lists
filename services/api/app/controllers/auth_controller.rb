class AuthController < ApplicationController
  def signin
    validator = GoogleIDToken::Validator.new
    begin
      payload = validator.check(params[:token], ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_ID'])
      user = User.find_or_create_by_email(payload['email'], payload['name'])

      self.current_user = user
      cookies[:user] = user.name.nil? ? nil : URI.encode(user.name)

      render json: user.as_json
    rescue GoogleIDToken::ValidationError => e
      logger.error(e)
      render json: { error: e.message }, status: 401
    end
  end

  def signout
    cookies.delete(:user)
    reset_session
  end

  def profile
    render json: current_user.as_json
  end
end
