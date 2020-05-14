const yaml = require('js-yaml');
const fs = require('fs');

const models = require('../models');

async function main() {
  const genres = await models.Genre.findAll();
  const movies = await models.Movie.findAll({ include: [models.Genre] });
  fs.writeFileSync('./db/seeders/db.yml', yaml.safeDump({
    genres: genres.map(genre => ({
      tmdbId: genre.tmdbId,
      name: genre.name
    })),
    movies: movies.map(movie => ({
      title: movie.title,
      imdbId: movie.imdbId,
      year: movie.year,
      rating: movie.rating,
      genres: movie.Genres.map(genre => genre.tmdbId)
    }))
  }));
}

(async function() {
  try {
    await main();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
