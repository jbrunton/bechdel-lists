class HomeController < ApplicationController
  def index
    render json: { hello: 'world!' }
  end

  def greet
    render json: { hello: 'there!' }
  end
end
