'use strict';
module.exports = (sequelize, DataTypes) => {

  const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    imdbId: {
      type: DataTypes.STRING,
      unique: true
    },
    year: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {});

  Movie.associate = function(models) {
    Movie.belongsToMany(models.List, {through: 'ListEntry'});
  };

  return Movie;
};