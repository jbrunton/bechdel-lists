const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/search', async (req, res) => {
  const query = req.query['query'];
  const results = await axios.get(`http://bechdeltest.com/api/v1/getMoviesByTitle?title=${query}`)
  const movies = results.data.map((movie) => {
    return {
      title: movie.title,
      imdbId: movie.imdbid,
      year: movie.year,
      rating: movie.rating
    };
  });
  res.json(movies)
});

module.exports = router;
