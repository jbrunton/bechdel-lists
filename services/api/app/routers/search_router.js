const express = require('express');
const models = require.main.require('./models');
const { Op } = require("sequelize");

const router = express.Router();

router.get('/', async (req, res) => {
  const query = req.query['query'];
  const movies = await models.Movie.findAll({
    where: {
      title: { [Op.iLike]: `%${query}%` }
    },
    order: [['year', 'DESC']]
  })
  res.json(movies)
});

module.exports = {
  routerPath: '/search',
  router: router
};
