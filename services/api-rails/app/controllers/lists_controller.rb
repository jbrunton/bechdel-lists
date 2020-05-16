class ListsController < ApplicationController
  def browse
    render json: List.all.as_json
  end

  def index
    render json: current_user.lists.as_json
  end

  def show
    list = List.find(params[:list_id])
    if !list.nil?
      render json: list.as_json(include: :movies)
    else
      render status: 404
    end
  end

  def create
    title = params[:title]
    list = List.new(title: title, user: current_user)
    if list.save
      render json: list.as_json
    else
      render json: list.errors, status: 422
    end
  end

  def destroy
    list = List.find(params[:list_id])
    if !list.nil?
      list.destroy!
      render status: 200
    else
      render status: 404
    end
  end
end
