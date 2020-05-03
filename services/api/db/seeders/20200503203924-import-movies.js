'use strict';

const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seedMovies = JSON.parse(fs.readFileSync('./db/seeders/movies.json', 'utf8'));
    const date = new Date();
    for (let movie of seedMovies) {
      movie.imdbId = movie.imdbid;
      delete movie.imdbid;
      movie.createdAt = movie.updatedAt = date;
    }
    try {
      await queryInterface.bulkInsert('Movies', seedMovies, {});
    } catch(e) {
      console.log(e);
      process.exit(1);
    }
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
