const axios = require('axios');
const models = require.main.require('./models');

// TODO: extract this to a use case
const movieRepository = {
  findByImdbId: async(imdbId) => {
    var movie = await models.Movie.findOne({ where: { imdbId: imdbId } })
    if (movie == null) {
      const result = await axios.get(`http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid=${imdbId}`)
      const movieDetails = result.data
      movie = await models.Movie.create({
        title: movieDetails.title,
        imdbId: movieDetails.imdbid,
        rating: movieDetails.rating,
        year: movieDetails.year
      })
    }
    return movie;
  }
}

module.exports = async function(req, res, next) {
  const movie = await movieRepository.findByImdbId(req.params.imdbId);
  req.movie = movie;
  return next();
};
