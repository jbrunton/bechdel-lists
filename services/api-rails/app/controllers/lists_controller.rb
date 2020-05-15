class ListsController < ApplicationController
  def browse
    render json: List.all.as_json
  end
end
