class ListsController < ApplicationController
  def browse
    render json: List.all.as_json
  end

  def show
    list = List.find(params[:list_id])
    if !list.nil?
      render json: list.as_json(include: :movies)
    else
      render status: 404
    end
  end
end
