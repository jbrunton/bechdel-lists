demo_user = User.find_or_create_by_email(
    ENV['SEED_USER_EMAIL'] || 'demo.user@example.com',
    ENV['SEED_USER_NAME'] || 'Demo User'
)

test_user = User.find_or_create_by_email(
    'test.user@example.com',
    'Test User'
)

def create_list(title, fileName, user)
  seed_data = JSON.parse(File.read("./db/seeds/#{fileName}"))
  list = user.lists.create(title: title, user: user)
  movie_ids = []
  seed_data.each do |movie_seed|
    imdb_id = movie_seed['imdbId']
    unless movie_ids.include?(imdb_id) # TODO: allow lists to include movies across different years
      movie = Movie.find_by(imdb_id: imdb_id)
      if movie.nil?
        puts("Could not find #{movie_seed['title']}.")
      else
        list.movies << movie
      end
      movie_ids << imdb_id
    end
  end
  list.save!
end

List.delete_all

create_list('Global Top 10 Movies (1999-2019)', 'topmovies.json', demo_user)
create_list('Marvel Cinematic Universe', 'mcu.json', demo_user)
create_list('Pixar', 'pixar.json', demo_user)
create_list('Star Wars', 'starwars.json', demo_user)
create_list('James Bond', 'bond.json', test_user)
