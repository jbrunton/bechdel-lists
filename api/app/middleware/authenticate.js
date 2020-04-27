const models = require.main.require('./models');

async function authenticate(req, res, next) {
  const userId = req.session.userId;
  if (userId) {
    const user = await models.User.findByPk(userId);
    req.user = user;
    return next();
  } else {
    res.send(401);
  }
}

module.exports = authenticate;
