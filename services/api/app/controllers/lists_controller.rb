class ListsController < ApplicationController
  before_action :set_list, except: [:browse, :index, :create]
  before_action :set_movie, only: [:add, :remove]

  def browse
    @lists = List.where(public: true)
    render json: @lists.as_json
  end

  def index
    @lists = current_user.lists
    render json: @lists.as_json
  end

  def show
    authorize! :read, @list
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

  def update
    authorize! :write, @list
    @list.update!(params.require(:list).permit(:public))
    render json: @list.as_json
  end

  def destroy
    authorize! :write, @list
    list.destroy!
  end

  def add
    authorize! :write, @list
    @list.movies << @movie
    @list.save
  end

  def remove
    authorize! :write, @list
    @list.movies.delete(@movie)
    @list.save
  end

  private

  def set_list
    @list = List.find(params[:list_id])
  end

  def set_movie
    @movie = Movie.find_by(imdb_id: params[:imdb_id])
  end
end
