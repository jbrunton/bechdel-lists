require 'rails_helper'
require 'null_db_helper'

RSpec.describe List, type: :model do
  describe ".stats_for" do
    it "calculates descriptive statistics for the given list of movies" do
      movies = [Movie.create(title: 'Movie 1', rating: 1), Movie.create(title: 'Movie 2', rating: 3)]
      stats = List.stats_for(movies)
      expect(stats).to eq(min_rating: 1, max_rating: 3, average_rating: 1)
    end
  end
end
