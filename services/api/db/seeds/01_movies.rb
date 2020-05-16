require 'yaml'

db = YAML.load(File.read('./db/seeds/db.yml'))
movie_genres = {}

date = Time.now
db['movies'].each do |movie|
  movie['created_at'] = movie['updated_at'] = date
  movie_genres[movie['imdb_id']] = movie['genre_ids']
  movie.delete('genre_ids')
end

db['genres'].each do |genre|
  genre['created_at'] = genre['updated_at'] = date
end

Movie.delete_all
Genre.delete_all

Movie.insert_all db['movies']
Genre.insert_all db['genres']

movie_genres.each do |imdb_id, genre_ids|
  movie = Movie.find_by(imdb_id: imdb_id)
  genres = Genre.where(tmdb_id: genre_ids)
  movie.genres = genres
  movie.save
end
