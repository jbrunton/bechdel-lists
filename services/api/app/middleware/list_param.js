const models = require.main.require('./models');

module.exports = async function(req, res, next) {
  const listId = req.params.listId;
  const includeParams = {
    model: models.Movie,
  };
  if (req.query.genreId) {
    includeParams.include = {
      model: models.Genre,
      through: { where: { GenreId: req.query.genreId } },
      required: true
    }
  }
  const list = await models.List.findByPk(listId, { include: includeParams });
  req.list = list;
  return next();
};
