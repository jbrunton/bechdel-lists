class GenresController < ApplicationController
  def index
    render json: Genre.all.as_json
  end

  def list_genres
    @list = List.find(params[:list_id])
    @genres = @list.genres
        .select(:id, :name, 'count(*) as count')
        .group(:id, :name)
        .order(count: :desc)
    render json: @genres.as_json
  end
end
