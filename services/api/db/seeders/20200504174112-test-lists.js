'use strict';

const models = require('../../models');
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

async function createList(title, fileName, userDetails) {
  const seedData = JSON.parse(fs.readFileSync(`./db/seeders/${fileName}`, 'utf8'));
  const user = await createUser(userDetails);
  const list = await models.List.create({
    title: title,
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
      await createList('Global Top 10s 1999-2019', 'topmovies.json', demoUserDetails);
      await createList('Star Wars', 'starwars.json', demoUserDetails);
      await createList('Marvel Cinematic Universe', 'mcu.json', demoUserDetails);
      await createList('Pixar', 'pixar.json', demoUserDetails);
      await createList('James Bond', 'bond.json', testUserDetails);
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
