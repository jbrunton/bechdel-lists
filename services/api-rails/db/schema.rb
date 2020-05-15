# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_15_134238) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "Genres", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255
    t.string "tmdbId", limit: 255
    t.datetime "createdAt", null: false
    t.datetime "updatedAt", null: false
    t.index ["tmdbId"], name: "Genres_tmdbId_key", unique: true
  end

  create_table "ListEntries", primary_key: ["ListId", "MovieId"], force: :cascade do |t|
    t.integer "ListId", null: false
    t.integer "MovieId", null: false
    t.datetime "createdAt", null: false
    t.datetime "updatedAt", null: false
  end

  create_table "Lists", id: :serial, force: :cascade do |t|
    t.string "title", limit: 255
    t.string "description", limit: 255
    t.float "averageRating"
    t.datetime "createdAt", null: false
    t.datetime "updatedAt", null: false
    t.integer "UserId", null: false
    t.integer "minRating"
    t.integer "maxRating"
  end

  create_table "MovieGenres", primary_key: ["MovieId", "GenreId"], force: :cascade do |t|
    t.integer "MovieId", null: false
    t.integer "GenreId", null: false
    t.datetime "createdAt", null: false
    t.datetime "updatedAt", null: false
  end

  create_table "Movies", id: :serial, force: :cascade do |t|
    t.string "title", limit: 255
    t.string "imdbId", limit: 255
    t.integer "year"
    t.integer "rating"
    t.datetime "createdAt", null: false
    t.datetime "updatedAt", null: false
    t.index ["imdbId"], name: "Movies_imdbId_key", unique: true
  end

  create_table "SequelizeMeta", primary_key: "name", id: :string, limit: 255, force: :cascade do |t|
  end

  create_table "Users", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255
    t.string "email", limit: 255, null: false
    t.datetime "createdAt", null: false
    t.datetime "updatedAt", null: false
    t.index ["email"], name: "Users_email_key", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "Lists", "\"Users\"", column: "UserId", name: "Lists_UserId_fkey", on_update: :cascade, on_delete: :nullify
end
