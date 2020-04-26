
const express = require('express');
const axios = require('axios');
const db = require('../../models');
const router = express.Router();

const movieRepository = {
  findByImdbId: async(imdbId) => {
    var movie = await db.Movie.findOne({ where: { imdbId: imdbId } })
    if (movie == null) {
      const result = await axios.get(`http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid=${imdbId}`)
      const movieDetails = result.data
      movie = await db.Movie.create({
        title: movieDetails.title,
        imdbId: movieDetails.imdbid,
        rating: movieDetails.rating,
        year: movieDetails.year
      })
    }
    return movie;
  }
}

router.get('/lists', async (req, res) => {
  const lists = await db.List.findAll();
  res.json(lists);
});

router.post('/lists', async (req, res) => {
  const title = req.body.title;
  const list = await db.List.build({ title: title });
  try {
    await list.save();
    res.json(list);
  } catch (e) {
    if (db.isValidationError(e)) {
      res.status(422).json(e.errors)
    } else {
      console.log(e);
      res.status(500)
    }
  }
});

router.get('/lists/:id', async (req, res) => {
  const list = await db.List.findByPk(req.params.id, { include: [db.Movie] });
  if (list != null) {
    res.json(list);
  } else {
    res.send(404)
  }
});

router.delete('/lists/:id', async (req, res) => {
  const list = await db.List.findByPk(req.params.id, { include: [db.Movie] });
  if (list != null) {
    await list.destroy();
    res.send(200)
  } else {
    res.send(404)
  }
});

router.post('/lists/:listId/movies/:imdbId', async (req, res) => {
  const list = await db.List.findByPk(req.params.listId)
  if (list != null) {
    const movie = await movieRepository.findByImdbId(req.params.imdbId);
    await list.addMovie(movie)
    await list.updateDetails();
    res.send(200);  
  } else {
    res.send(404);
  }
});

router.delete('/lists/:listId/movies/:imdbId', async (req, res) => {
  const list = await db.List.findByPk(req.params.listId)
  if (list != null) {
    const movie = await db.Movie.findOne({ where: { imdbId: req.params.imdbId } })
    if (movie != null) {
      list.removeMovie(movie);
      await list.updateDetails();
      res.send(200);
    }
  } else {
    res.send(404);
  }
});

module.exports = router;
