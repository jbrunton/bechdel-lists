'use strict';

const models = require('../../models');
const yaml = require('js-yaml');
const fs   = require('fs');

const userEmail = 'test.user@example.com';
const userName = 'Test User';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const user = await models.User.create({
        email: userEmail,
        name: userName
      });
      const seeds = yaml.safeLoad(fs.readFileSync('./db/seeders/lists.yml', 'utf8'));
      for (const listSeed of seeds.testUserLists) {
        const list = await models.List.create({
          title: listSeed.title,
          UserId: user.id
        });

        for (const movieSeed of listSeed.movies) {
          const movie = await models.Movie.create(movieSeed);
          await list.addMovie(movie)
          await list.updateDetails();
        }
      }
    } catch (e) {
      console.log(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const user = await models.User.findOne({ where: { email: userEmail } });
    await user.destroy();
  }
};
