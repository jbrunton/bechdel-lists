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
    // associations can be defined here
  };
  return Genre;
};
