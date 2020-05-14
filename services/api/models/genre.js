'use strict';
module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    name: DataTypes.STRING,
    tmdbId: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  Genre.associate = function(models) {
    Genre.belongsToMany(models.Movie, {through: 'MovieGenres'});
  };
  return Genre;
};
