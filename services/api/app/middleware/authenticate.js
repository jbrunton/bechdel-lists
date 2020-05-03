const models = require.main.require('./models');

module.exports = async function (req, res, next) {
  const userId = req.session.userId;
  if (userId) {
    const user = await models.User.findByPk(userId);
    req.user = user;
    return next();
  } else {
    res.send(401);
  }
};
