class SearchController < ApplicationController
  def index
    movies = Movie
        .where('title ILIKE ?', "%#{params[:query]}%")
        .order(year: :desc)
        .take(20)
    render json: movies
  end
end
