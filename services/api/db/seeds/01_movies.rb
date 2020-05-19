require 'yaml'

db = YAML.load(File.read('./db/seeds/db.yml'))
movie_genres = []

date = Time.now
db['movies'].each do |movie|
  movie['created_at'] = movie['updated_at'] = date
  movie['genre_ids'].each do |tmdb_id|
    movie_genres << { imdb_id: movie['imdb_id'], genre_id: tmdb_id }
  end
  movie.delete('genre_ids')
end

db['genres'].each do |genre|
  genre['created_at'] = genre['updated_at'] = date
end

Movie.delete_all
Genre.delete_all

Movie.insert_all db['movies']
Genre.insert_all db['genres']

movies_id_cache = Movie.all.map { |movie| [movie.imdb_id, movie.id] }.to_h
genres_id_cache = Genre.all.map { |genre| [genre.tmdb_id, genre.id] }.to_h

genres_movies_records = movie_genres.map do |record|
  { movie_id: movies_id_cache[record[:imdb_id]], genre_id: genres_id_cache[record[:genre_id]]}
end

GenresMovies.insert_all genres_movies_records
