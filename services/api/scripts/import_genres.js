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
  const movies = (await models.Movie.findAll({ include: [models.Genre] }));
  const indexes = Array.from({length: movies.length}, (_, i) => i);
  console.log(indexes);
  for (let index of indexes) {
    const movie = movies[index];
    const progress = (index / movies.length) * 100;
    console.log(`Importing genres for ${movie.title} (${progress.toFixed(1)}%)`);
    const externalData = await moviedb.find({ id: `tt${movie.imdbId}`, external_source: 'imdb_id' });
    const tmdbGenreIds = externalData.movie_results.length > 0 ? externalData.movie_results[0].genre_ids : []
    const genres = await models.Genre.findAll({ where: { tmdbId: tmdbGenreIds.map(x => x.toString()) } });
    for (let genre of genres) {
      console.log(`Adding genre ${genre.name} to ${movie.title}`);
      await movie.addGenre(genre);
    }
  };
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
