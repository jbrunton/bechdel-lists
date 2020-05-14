'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MovieGenres', {
      MovieId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      GenreId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MovieGenres');
  }
};
