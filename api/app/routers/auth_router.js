const express = require('express');
const models = require.main.require('./models');
const { OAuth2Client } = require('google-auth-library');

const clientId = process.env.GOOGLE_CLIENT_ID;

const router = express.Router();
const client = new OAuth2Client(clientId);

router.post('/auth/signin', async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.idToken,
      audience: clientId
    });
    const payload = ticket.getPayload();

    const [user, created] = await models.User.findOrCreate({
      where: { email: payload.email }
    });
    if (created) {
      user.logEvent('Created new user', user);
    } else {
      user.logEvent('Found existing user', user);
      user.name = payload.name;
      await user.save();
    }

    req.session.userId = user.id;
    res.json(user);
  } catch (e) {
    console.log('Verification failed: ' + e);
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
