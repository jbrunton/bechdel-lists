
const express = require('express');
const axios = require('axios');
const models = require.main.require('./models');
const authenticate = require.main.require('./app/middleware/authenticate');
const authorize = require.main.require('./app/middleware/authorize');
const listParam = require.main.require('./app/middleware/list_param');
const imdbIdParam = require.main.require('./app/middleware/imdb_id_param');

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

async function queryRatingsByYear(list) {
  const query = `
    select year, rating, count(*)
    from "Movies" m
    inner join "ListEntries" e on e."MovieId" = m.id
    inner join "Lists" l on l.id = e."ListId"
    where l.id = ${list.id}
    group by year, rating
    order by year`;
  const results = await models.sequelize.query(query, { type: models.Sequelize.QueryTypes.SELECT });
  return results;
}

router.get('/:listId/charts/by_year', async (req, res) => {
  if (req.list != null) {
    const results = await queryRatingsByYear(req.list);

    const ratingsData = [['Year', '0', '1', '2', '3']];
    const averageData = [['Year', 'Average']];

    const minYear = Math.min(...results.map(result => result.year));
    const maxYear = Math.max(...results.map(result => result.year));
    
    for (let year = minYear; year <= maxYear; year++) {
      const ratingsRow = [year.toString()];
      const ratings = [];
      for (let rating = 0; rating <= 3; ++rating) {
        const result = results.find(x => x.year == year && x.rating == rating);
        ratings.push(result ? parseInt(result.count) : 0);
      }
      ratingsRow.push(...ratings);
      ratingsData.push(ratingsRow);

      const totalScore = ratings[1] + ratings[2] * 2 + ratings[3] * 3;
      const totalCount = ratings.reduce((total, x) => total + x, 0);
      const average = totalScore / totalCount;
      averageData.push([year.toString(), average]);
    }
    res.json({
      ratingsData: ratingsData,
      averageData: averageData
    });
  } else {
    res.send(404)
  }
});

module.exports = {
  routerPath: '/lists',
  router: router
};
