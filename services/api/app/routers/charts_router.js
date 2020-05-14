const express = require('express');
const models = require.main.require('./models');
const { Op } = require("sequelize");

const router = express.Router();

async function groupByYear(query) {
  const results = await models.sequelize.query(query, { type: models.Sequelize.QueryTypes.SELECT });
  const data = [['Rating', '0', '1', '2', '3', 'Avg' ]];
  for (let year = 1980; year < 2020; year++) {
    const row = [year.toString()];
    const ratings = [];
    for (let rating = 0; rating <= 3; ++rating) {
      const result = results.find(x => x.year == year && x.rating == rating);
      ratings.push(result ? parseInt(result.count) : 0);
    }
    const totalScore = ratings[1] + ratings[2] * 2 + ratings[3] * 3;
    const totalCount = ratings.reduce((total, x) => total + x, 0);
    const avg = totalScore / totalCount;
    row.push(...ratings);
    row.push(avg);
    data.push(row);
  }
  return data;
}

router.get('/ratings_by_year', async (req, res) => {
  const data = await groupByYear(`
    select year, rating, count(*)
    from "Movies"
    where year >= 1980
    group by year, rating order by year`
  );
  res.json(data);
});

router.get('/top_10_ratings_by_year', async (req, res) => {
  const list = await models.List.findOne({ where: { title: 'Global Top 10s'}, include: [models.Movie] });
  const data = await groupByYear(`
    select year, rating, count(*)
    from "Movies" m
    inner join "ListEntries" e on e."MovieId" = m.id
    inner join "Lists" l on l.id = e."ListId"
    where year >= 1980 and l.id = ${list.id}
    group by year, rating
    order by year`);
  res.json(data);
});

module.exports = {
  routerPath: '/charts',
  router: router
};
