const { MovieDb } = require('moviedb-promise');

const models = require('../models');

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY required");
}
const moviedb = new MovieDb(apiKey);

async function main() {
  const response = await moviedb.genreMovieList();
  for (let genreData of response.genres) {
    const [genre, created] = await models.Genre.findOrCreate({
      where: { tmdbId: genreData.id.toString() }
    });
    genre.name = genreData.name;
    await genre.save();
    if (created) {
      console.log('Created new genre: ' + JSON.stringify(genre.get()));
    } else {
      console.log('Found existing genre: ' + JSON.stringify(genre.get()));
    }
  }
}

(async function() {
  try {
    await main();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
