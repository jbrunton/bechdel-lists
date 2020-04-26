'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    averageRating: DataTypes.FLOAT
  }, {});
  List.associate = function(models) {
    // associations can be defined here
  };
  return List;
};