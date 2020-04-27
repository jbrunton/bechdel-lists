const express = require('express');
const models = require.main.require('./models');

const router = express.Router();

router.get('/users/me', async (req, res) => {
  const userId = req.session.userId;
  // console.log(`sessionId: ${req.session.id}, userId: ${userId}`);
  if (userId) {
    const user = await models.User.findByPk(userId);
    user.logEvent('Found user');
    res.json(user);
  } else {
    console.log('Invalid session');
    res.send(401);
  }
});

module.exports = router;