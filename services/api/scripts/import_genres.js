const { MovieDb } = require('moviedb-promise');

const models = require('../models');

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY required");
}
const moviedb = new MovieDb(apiKey);

async function importGenres() {
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

async function updateGenres() {
  const movies = (await models.Movie.findAll()).slice(0, 10);
  for (let movie of movies) {
    console.log('imdbId: ' + movie.imdbId);
    const externalData = await moviedb.find({ id: `tt${movie.imdbId}`, external_source: 'imdb_id' });
    console.log('genre info for ' + movie.title + ' : ' + JSON.stringify(externalData.movie_results[0].genre_ids));
  }
}

async function main() {
  //await importGenres();
  await updateGenres();
}

(async function() {
  try {
    await main();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
