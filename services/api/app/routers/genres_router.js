const express = require('express');

const models = require.main.require('./models');
const Genre = models.Genre;

const router = express.Router();

router.get('/', async (req, res) => {
  const genres = await Genre.findAll();
  res.json(genres);
});

module.exports = {
  router: router,
  routerPath: '/genres',
};
