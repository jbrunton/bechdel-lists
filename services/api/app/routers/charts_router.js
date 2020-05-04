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

// const groupBy = function(xs, keys, reducer) {
//   const groups = xs.reduce(function(rv, x) {
//     const key = keys.map(k => x[k]);
//     (rv[key] = rv[key] || []).push(x);
//     return rv;
//   }, {});
//   const result = {};
//   const keyToObj = (key) => keys.map()
//   for (let [key, value] of Object.entries(obj)) {
//     result[]
//   }
// };

router.get('/top_10_ratings_by_year', async (req, res) => {
  const list = await models.List.findOne({ where: { title: 'Global Top 10s'}, include: [models.Movie] });
  const query = `
    select year, rating, count(*)
    from "Movies" m
    inner join "ListEntries" e on e."MovieId" = m.id
    inner join "Lists" l on l.id = e."ListId"
    where year >= 1980 and l.id = ${list.id}
    group by year, rating
    order by year`;
  const results = await models.sequelize.query(query, { type: models.Sequelize.QueryTypes.SELECT });
  const data = [['Rating', '0', '1', '2', '3' ]];
  for (let year = 1999; year < 2020; year++) {
    const row = [year.toString()];
    for (let rating = 0; rating <= 3; ++rating) {
      const result = results.find(x => x.year == year && x.rating == rating);
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
