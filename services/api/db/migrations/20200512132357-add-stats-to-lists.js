'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.addColumn('Lists', 'minRating', {
        type: Sequelize.INTEGER
      }, { transaction: t });
      await queryInterface.addColumn('Lists', 'maxRating', {
        type: Sequelize.INTEGER
      }, { transaction: t });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeColumn('Lists', 'minRating');
      await queryInterface.removeColumn('Lists', 'maxRating');
    });
  }
};
