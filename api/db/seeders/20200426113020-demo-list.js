'use strict';

const models = require('../../models');
const yaml = require('js-yaml');
const fs   = require('fs');

const userEmail = process.env.SEED_USER_EMAIL || 'demo.user@example.com';
const userName = process.env.SEED_USER_NAME || 'Demo User';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const user = await models.User.findOrCreateByEmail(userEmail, userName);
      const seeds = yaml.safeLoad(fs.readFileSync('./db/seeders/lists.yml', 'utf8'));
      for (const listSeed of seeds.demoUserLists) {
        const list = await models.List.create({
          title: listSeed.title,
          UserId: user.id
        });

        for (const movieSeed of listSeed.movies) {
          const movie = (typeof movieSeed === 'string')
              ? await models.Movie.findOne({ where: { imdbId: movieSeed } })
              : await models.Movie.create(movieSeed);
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
