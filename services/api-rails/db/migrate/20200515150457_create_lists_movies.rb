class CreateListsMovies < ActiveRecord::Migration[6.0]
  def change
    create_table :lists_movies, id: false do |t|
      t.belongs_to :list
      t.belongs_to :movie
    end
  end
end
