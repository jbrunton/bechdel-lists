
const express = require('express');
const models = require.main.require('./models');
const authenticate = require.main.require('./app/middleware/authenticate');
const authorize = require.main.require('./app/middleware/authorize');
const listParam = require.main.require('./app/middleware/list_param');
const imdbIdParam = require.main.require('./app/middleware/imdb_id_param');
const charts = require.main.require('./app/usecases/charts');

const router = express.Router();
router.param('listId', listParam);
router.param('imdbId', imdbIdParam);

router.get('/', authenticate, async (req, res) => {
  const lists = await req.user.getLists();
  res.json(lists);
});

router.get('/browse', async (req, res) => {
  const lists = await models.List.findAll();
  res.json(lists);
});

router.post('/', authenticate, async (req, res) => {
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

// TODO: reinstate [authenticate, authorize(models.List)] based on public flag
router.get('/:listId', async (req, res) => {
  if (req.list != null) {
    res.json(req.list);
  } else {
    res.send(404)
  }
});

router.delete('/:listId', [authenticate, authorize(models.List)], async (req, res) => {
  if (req.list != null) {
    await req.list.destroy();
    res.send(200)
  } else {
    res.send(404)
  }
});

router.post('/:listId/movies/:imdbId', [authenticate, authorize(models.List)], async (req, res) => {
  if (req.list != null) {
    const movie = req.movie;
    await req.list.addMovie(movie)
    await req.list.updateDetails();
    res.send(200);  
  } else {
    res.send(404);
  }
});

router.delete('/:listId/movies/:imdbId', [authenticate, authorize(models.List)], async (req, res) => {
  if (req.list != null) {
    const movie = req.movie;
    if (movie != null) {
      await req.list.removeMovie(movie);
      await req.list.updateDetails();
      res.send(200);
    }
  } else {
    res.send(404);
  }
});

router.get('/:listId/charts/by_year', async (req, res) => {
  if (req.list != null) {
    const data = await charts.groupByYear(req.list);
    res.json(data);
  } else {
    res.send(404)
  }
});

module.exports = {
  routerPath: '/lists',
  router: router
};
