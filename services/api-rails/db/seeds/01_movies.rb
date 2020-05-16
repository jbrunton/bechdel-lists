require 'yaml'

db = YAML.load(File.read('./db/seeds/db.yml'))
movie_genres = {}

date = Time.now
db['movies'].each do |movie|
  movie['created_at'] = movie['updated_at'] = date
  movie_genres[movie['id']] = movie['genre_ids'];
  movie.delete('genre_ids')
end

Movie.delete_all
Movie.insert_all db['movies']
