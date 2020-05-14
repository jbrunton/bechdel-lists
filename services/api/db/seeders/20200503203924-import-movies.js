'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const models = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const db = yaml.safeLoad(fs.readFileSync('./db/seeders/db.yml', 'utf8'));
    const movieGenres = {};
    const date = new Date();
    for (let movie of db.movies) {
      movie.createdAt = movie.updatedAt = date;
      movieGenres[movie.imdbId] = movie.genreIds;
      delete movie.genreIds;
    }
    for (let genre of db.genres) {
      genre.createdAt = genre.updatedAt = date;
    }
    try {
      await queryInterface.bulkInsert('Movies', db.movies, {});
      await queryInterface.bulkInsert('Genres', db.genres, {});
      for (let [imdbId, genreIds] of Object.entries(movieGenres)) {
        const movie = await models.Movie.findOne({ where: { imdbId: imdbId } });
        const genres = await models.Genre.findAll({ where: { tmdbId: genreIds } });
        await movie.addGenres(genres);
      }
    } catch(e) {
      console.log(e);
      process.exit(1);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Movies', null, {});
    await queryInterface.bulkDelete('Genres', null, {});
  }
};
