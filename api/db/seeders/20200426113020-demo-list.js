'use strict';

const db = require('../../models');
const yaml = require('js-yaml');
const fs   = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const seeds = yaml.safeLoad(fs.readFileSync('./db/seeders/lists.yml', 'utf8'));
      for (const listSeed of seeds.lists) {
        const list = await db.List.create({
          title: listSeed.title
        });

        for (const movieSeed of listSeed.movies) {
          const movie = await db.Movie.create(movieSeed);
          await list.addMovie(movie)
          await list.updateDetails();
        }
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
