class ListsController < ApplicationController
  def browse
    render json: List.all.as_json
  end

  def index
    render json: current_user.lists.as_json
  end

  def show
    @list = List.find(params[:list_id])
    if params[:genre_id].nil?
      render json: @list.as_json(include: :movies)
    else
      @genre = Genre.find(params[:genre_id])
      movies = @list.movies.joins(:genres).where('genres.id': @genre.id)
      stats = List.stats_for(movies)
      render json: @list.as_json.merge(stats, movies: movies)
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
    list.destroy!
  end

  def add
    @list = List.find(params[:list_id])
    @movie = Movie.find_by(imdb_id: params[:imdb_id])
    @list.movies << @movie
    @list.save
  end

  def remove
    @list = List.find(params[:list_id])
    @movie = Movie.find_by(imdb_id: params[:imdb_id])
    @list.movies.delete(@movie)
    @list.save
  end
end
