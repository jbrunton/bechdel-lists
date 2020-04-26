'use strict';

const db = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const list = await db.List.create({
        title: 'Star Trek'
      });

      console.log('list: ' + list.id);

      const movie = await db.Movie.create({
        title: "Star Trek",
        imdbId: "0796366",
        year: 2009,
        rating: 3,
      });
    } catch (e) {
      console.log(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ListEntries', null, {});
    await queryInterface.bulkDelete('Movies', null, {});
    await queryInterface.bulkDelete('Lists', null, {});
  }
};
