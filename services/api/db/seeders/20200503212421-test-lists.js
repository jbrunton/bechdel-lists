'use strict';

const models = require('../../models');
const yaml = require('js-yaml');
const fs   = require('fs');

const demoUserDetails = {
  email: process.env.SEED_USER_EMAIL || 'demo.user@example.com',
  userName: process.env.SEED_USER_NAME || 'Demo User'
};

const testUserDetails = {
  email: 'test.user@example.com',
  name: 'Test User'
};

async function createUser(details) {
  return await models.User.findOrCreateByEmail(details.email, details.name);
}

async function createLists(lists, userDetails) {
  const user = await createUser(userDetails);
  for (const listSeed of lists) {
    const list = await models.List.create({
      title: listSeed.title,
      UserId: user.id
    });

    for (const movieSeed of listSeed.movies) {
      const movie = await models.Movie.findOne({ where: { imdbId: movieSeed.imdbId } });
      if (!movie) {
        throw new Error(`Could not find ${movieSeed.title}. Make sure you run the import-movies migration first`);
      }
      await list.addMovie(movie)
    }
    await list.updateDetails();
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const seeds = yaml.safeLoad(fs.readFileSync('./db/seeders/lists.yml', 'utf8'));
      await createLists(seeds.demoUserLists, demoUserDetails);
      await createLists(seeds.testUserLists, testUserDetails);
    } catch (e) {
      console.log(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ListEntries', null, {});
    await queryInterface.bulkDelete('Lists', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
