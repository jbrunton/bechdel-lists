class CreateGenresMovies < ActiveRecord::Migration[6.0]
  def change
    create_table :genres_movies, id: false do |t|
      t.belongs_to :genre
      t.belongs_to :movie
    end
    add_index :genres_movies, [:genre_id, :movie_id], unique: true
  end
end
