const express = require('express');
const router = express.Router();
const models = require.main.require('./models');

router.post('/signin', async (req, res) => {
  const user = await models.User.findOne({ where: { email: req.body.email } });
  if (user) {
    req.session.userId = user.id;
    res.json(user);
  } else {
    res.send(404);
  }
});

router.post('/signout', async (req, res) => {
  req.session.destroy(function() {
    res.clearCookie('connect.sid', { path: '/' }).send(200);
  });
});

module.exports = {
  router: router,
  routerPath: '/dev',
  environments: ['development']
};
