const models = require.main.require('./models');

module.exports = {
  groupByYear: groupByYear
};

async function groupByYear(req) {
  const results = await queryRatingsByYear(req);

  const ratingsData = [['Year', '0', '1', '2', '3']];
  const averageData = [['Year', 'Average']];

  const minYear = Math.min(...results.map(result => result.year));
  const maxYear = Math.max(...results.map(result => result.year));
  
  for (let year = minYear; year <= maxYear; year++) {
    const ratings = getRatingsForYear(results, year);
    ratingsData.push(buildRatingsRow(ratings, year));
    averageData.push(buildAverageRow(ratings, year));
  }

  return {
    ratingsData: ratingsData,
    averageData: averageData
  };
}

async function queryRatingsByYear(req) {
  const genreFilterJoin = req.query.genreId
    ? `inner join "MovieGenres" mg on mg."MovieId" = m.id`
    : '';
  const genreFilterWhere = req.query.genreId
    ? `and mg."GenreId" = :genreId`
    : '';
  const query = `
    select year, rating, count(*)
    from "Movies" m
    inner join "ListEntries" e on e."MovieId" = m.id
    inner join "Lists" l on l.id = e."ListId"
    ${genreFilterJoin}
    where l.id = :listId ${genreFilterWhere}
    group by year, rating
    order by year`;
  const results = await models.sequelize.query(query, {
    replacements: { listId: req.params.listId, genreId: req.query.genreId },
    type: models.Sequelize.QueryTypes.SELECT
  });
  return results;
}

function getRatingsForYear(results, year) {
  const ratings = [];
  for (let rating = 0; rating <= 3; ++rating) {
    const result = results.find(x => x.year == year && x.rating == rating);
    ratings.push(result ? parseInt(result.count) : 0);
  }
  return ratings;
}

function buildRatingsRow(ratings, year) {
  return [year.toString()].concat(...ratings);
}

function buildAverageRow(ratings, year) {
  const totalScore = ratings[1] + ratings[2] * 2 + ratings[3] * 3;
  const totalCount = ratings.reduce((total, x) => total + x, 0);
  const average = totalScore / totalCount;
  return [year.toString(), average];
}
