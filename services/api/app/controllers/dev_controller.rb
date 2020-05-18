class DevController < ApplicationController
  def signin
    user = User.find_or_create_by_email(params['email'], params['name'])

    self.current_user = user
    cookies[:user] = URI.encode(user.name)

    render json: user.as_json
  end
end
