class ChartsController < ApplicationController
  def by_year
    @list = List.find(params[:list_id])
    @results = List.joins(:movies)
        .select('year, rating, count(*) as count')
        .where(id: @list.id)
        .group(:year, :rating)

    ratings_data = [%w(Year 0 1 2 3)]
    average_data = [%w(Year Average)]

    min_year = @results.map { |result| result.year }.min
    max_year = @results.map { |result| result.year }.max

    for year in min_year..max_year
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
    ratings = []
    for rating in 0..3
      result = results.find { |x| x[:year] == year && x[:rating] == rating }
      ratings << (result.try(:[], :count) || 0)
    end
    ratings
  end

  def build_average_row(ratings, year)
    total_score = ratings[1] + ratings[2] * 2 + ratings[3] * 3
    average = total_score.to_f / ratings.sum
    [year.to_s, average]
  end
end
