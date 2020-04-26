'use strict';

const db = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const list = await db.List.create({
        title: 'Star Trek Reboots'
      });

      console.log('list: ' + list.id);

      const movies = [{
        title: "Star Trek Beyond",
        imdbId: "2660888",
        year: 2016,
        rating: 1
      },
      {
        title: "Star Trek Into Darkness",
        imdbId: "1408101",
        year: 2013,
        rating: 1
      },
      {
        title: "Star Trek",
        imdbId: "0796366",
        year: 2009,
        rating: 3
      }]

      for (const details of movies) {
        const movie = await db.Movie.create(details);
        await list.addMovie(movie)
        await list.updateDetails();
      }
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
