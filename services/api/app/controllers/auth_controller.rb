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

  def authorize
    type = params[:type].classify.constantize
    instance = type.find(params[:id])
    if type == List
      render json: {
          is_owner: instance.user == current_user
      }
    else
      raise "Unexpected type: #{params[:type]}"
    end
  end
end
