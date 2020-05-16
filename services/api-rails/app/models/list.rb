class List < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :movies
  has_many :genres, through: :movies

  before_save :update_details

  def self.stats_for(movies)
    ratings = movies.pluck(:rating).compact
    if ratings.length > 0
      return {
          average_rating: ratings.sum.to_f / ratings.length,
          min_rating: ratings.min,
          max_rating: ratings.max
      }
    else
      return {
          average_rating: nil,
          min_rating: nil,
          max_rating: nil
      }
    end
  end

  def update_details
    stats = List.stats_for(self.movies)
    self.average_rating = stats[:average_rating]
    self.min_rating = stats[:min_rating]
    self.max_rating = stats[:max_rating]

    if self.movies.size == 0
      self.description = nil
    elsif self.movies.size == 1
      self.description = self.movies[0].title
    elsif self.movies.length == 2
      self.description = "#{self.movies[0].title} and #{self.movies[1].title}"
    else
      remainder = movies.length - 2
      remainder_description = remainder > 1 ? 'others' : 'other'
      self.description = "#{movies[0].title}, #{movies[1].title} and #{remainder} #{remainder_description}"
    end
  end
end
