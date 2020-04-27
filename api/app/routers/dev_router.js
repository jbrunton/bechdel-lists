const express = require('express');
const router = express.Router();
const models = require.main.require('./models');

router.get('/signin', async (req, res) => {
  const user = await models.User.findOne({ where: { email: req.query.email } });
  if (user) {
    req.session.userId = user.id;
    res.json(user);
  } else {
    res.send(404);
  }
});

module.exports = {
  router: router,
  routerPath: '/dev',
  environments: ['development']
};
