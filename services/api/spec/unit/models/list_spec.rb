require 'rails_helper'
require 'null_db_helper'

RSpec.describe List, type: :model do
  describe ".stats_for" do
    it "calculates descriptive statistics for the given list of movies" do
      movies = [Movie.create(title: 'Movie 1', rating: 1), Movie.create(title: 'Movie 2', rating: 3)]
      stats = List.stats_for(movies)
      expect(stats).to eq(min_rating: 1, max_rating: 3, average_rating: 2)
    end
  end

  describe "#update_details" do
    let(:movie1) { Movie.new(title: 'Movie 1', rating: 1) }
    let(:movie2) { Movie.new(title: 'Movie 2', rating: 2) }
    let(:movie3) { Movie.new(title: 'Movie 3', rating: 3) }
    let(:movie4) { Movie.new(title: 'Movie 4', rating: 3) }

    it "updates descriptive statistics for ratings" do
      list = List.new(movies: [movie1, movie3])

      list.update_details

      expect(list.min_rating).to eq(1)
      expect(list.max_rating).to eq(3)
      expect(list.average_rating).to eq(2)
    end

    context "it updates the description" do
      it "for empty lists" do
        list = List.new(movies: [])
        list.update_details
        expect(list.description).to eq(nil)
      end

      it "for singleton lists" do
        list = List.new(movies: [movie1])
        list.update_details
        expect(list.description).to eq('Movie 1')
      end

      it "for two item lists" do
        list = List.new(movies: [movie1, movie2])
        list.update_details
        expect(list.description).to eq('Movie 1 and Movie 2')
      end

      it "for three item lists" do
        list = List.new(movies: [movie1, movie2, movie3])
        list.update_details
        expect(list.description).to eq('Movie 1, Movie 2 and 1 other')
      end

      it "for lists with more than three items" do
        list = List.new(movies: [movie1, movie2, movie3, movie4])
        list.update_details
        expect(list.description).to eq('Movie 1, Movie 2 and 2 others')
      end
    end
  end
end
