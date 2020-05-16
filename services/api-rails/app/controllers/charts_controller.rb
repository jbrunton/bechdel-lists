class ChartsController < ApplicationController
  def by_year
    @list = List.find(params[:list_id])
    @results = @list.movies
        .select('year, rating, count(*) as count')
        .group(:year, :rating)

    ratings_data = [%w(Year 0 1 2 3)]
    average_data = [%w(Year Average)]

    years = @results.pluck(:year)
    (years.min..years.max).each do |year|
      ratings = get_ratings_for_year(@results, year)
      ratings_data << [year.to_s] + ratings
      average_data << build_average_row(ratings, year)
    end

    render json: {
        ratingsData: ratings_data,
        averageData: average_data
    }.as_json
  end

  private

  def get_ratings_for_year(results, year)
    (0..3).map do |rating|
      results
          .find { |x| x[:year] == year && x[:rating] == rating }
          .try(:[], :count) || 0
    end
  end

  def build_average_row(ratings, year)
    total_score = ratings[1] + ratings[2] * 2 + ratings[3] * 3
    average = total_score.to_f / ratings.sum
    [year.to_s, average]
  end
end
