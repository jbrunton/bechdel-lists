const models = require.main.require('./models');

module.exports = async function(req, res, next) {
  const listId = req.params.listId;
  const list = await models.List.findByPk(listId, { include: [models.Movie] });
  req.list = list;
  return next();
};
