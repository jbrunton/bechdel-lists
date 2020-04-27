
const express = require('express');
const axios = require('axios');
const models = require.main.require('./models');
const authenticate = require.main.require('./app/middleware/authenticate');
const authorize = require.main.require('./app/middleware/authorize');
const listParam = require.main.require('./app/middleware/list_param');

const router = express.Router();
router.param('listId', listParam);

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

router.get('/lists', authenticate, async (req, res) => {
  const lists = await req.user.getLists();
  res.json(lists);
});

router.post('/lists', authenticate, async (req, res) => {
  const title = req.body.title;
  const list = await models.List.build({ title: title, UserId: req.user.id });
  try {
    await list.save();
    res.json(list);
  } catch (e) {
    if (models.isValidationError(e)) {
      res.status(422).json(e.errors)
    } else {
      console.log(e);
      res.status(500)
    }
  }
});

router.get('/lists/:listId', [authenticate, authorize(models.List)], async (req, res) => {
  if (req.list != null) {
    res.json(req.list);
  } else {
    res.send(404)
  }
});

router.delete('/lists/:listId', async (req, res) => {
  if (req.list != null) {
    await req.list.destroy();
    res.send(200)
  } else {
    res.send(404)
  }
});

router.post('/lists/:listId/movies/:imdbId', async (req, res) => {
  if (req.list != null) {
    const movie = await movieRepository.findByImdbId(req.params.imdbId);
    await req.list.addMovie(movie)
    await req.list.updateDetails();
    res.send(200);  
  } else {
    res.send(404);
  }
});

router.delete('/lists/:listId/movies/:imdbId', async (req, res) => {
  if (req.list != null) {
    const movie = await models.Movie.findOne({ where: { imdbId: req.params.imdbId } })
    if (movie != null) {
      await req.list.removeMovie(movie);
      await req.list.updateDetails();
      res.send(200);
    }
  } else {
    res.send(404);
  }
});

module.exports = router;
