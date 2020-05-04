'use strict';

const models = require('../../models');
const fs   = require('fs');

const demoUserDetails = {
  email: process.env.SEED_USER_EMAIL || 'demo.user@example.com',
  userName: process.env.SEED_USER_NAME || 'Demo User'
};

async function createUser(details) {
  return await models.User.findOrCreateByEmail(details.email, details.name);
}

async function createList(seedData) {
  const user = await createUser(demoUserDetails);
  const list = await models.List.create({
    title: 'Global Top 10s',
    UserId: user.id
  });

  for (const movieSeed of seedData) {
    const movie = await models.Movie.findOne({ where: { imdbId: movieSeed.imdbId } });
    if (!movie) {
      console.log(`Could not find ${movieSeed.title}.`);
    }
    await list.addMovie(movie);
  }
  await list.updateDetails();
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const seedData = JSON.parse(fs.readFileSync('./db/seeders/topmovies.json', 'utf8'));
      await createList(seedData);
    } catch (e) {
      console.log(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
};
