const express = require('express');
const models = require.main.require('./models');
const { Op } = require("sequelize");

const router = express.Router();

router.get('/ratings_by_year', async (req, res) => {
  const results = await models.sequelize.query(
    'select year, rating, count(*) from "Movies" where year >= 1980 group by year, rating order by year',
    { type: models.Sequelize.QueryTypes.SELECT });
  const data = [['Rating', '0', '1', '2', '3' ]];
  for (let year = 1980; year < 2020; year++) {
    const row = [year.toString()];
    for (let rating = 0; rating <= 3; ++rating) {
      const result = results.find((x) => x.year == year && x.rating == rating);
      row.push(result ? parseInt(result.count) : 0);
    }
    data.push(row);
  }
  res.json(data);
});

module.exports = {
  routerPath: '/charts',
  router: router
};
