'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListEntry = sequelize.define('ListEntry', {
    ListId: DataTypes.INTEGER,
    MovieId: DataTypes.INTEGER
  }, {});

  ListEntry.associate = function(models) {
    // associations can be defined here
  };
  
  return ListEntry;
};