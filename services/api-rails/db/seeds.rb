# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'yaml'

db = YAML.load(File.read('./db/seeds/db.yml'))
movie_genres = {}
date = Time.now
db['movies'].each do |movie|
  movie['created_at'] = movie['updated_at'] = date
  movie_genres[movie['id']] = movie['genre_ids'];
  movie.delete('genre_ids')
end
Movie.insert_all db['movies']
