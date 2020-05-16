class CreateLists < ActiveRecord::Migration[6.0]
  def change
    create_table :lists do |t|
      t.string :title
      t.string :description
      t.float :average_rating
      t.integer :min_rating
      t.integer :max_rating
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
