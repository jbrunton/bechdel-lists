class CreateMovies < ActiveRecord::Migration[6.0]
  def change
    create_table :movies do |t|
      t.string :title
      t.string :imdb_id
      t.integer :year
      t.integer :rating

      t.timestamps
    end
  end
end
