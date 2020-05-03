const express = require('express');
const models = require.main.require('./models');
const { OAuth2Client } = require('google-auth-library');

const clientId = process.env.GOOGLE_CLIENT_ID;

const router = express.Router();
const client = new OAuth2Client(clientId);

router.post('/signin', async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.idToken,
      audience: clientId
    });
    const payload = ticket.getPayload();
    const user = await models.User.findOrCreateByEmail(payload.email, payload.name);
    req.session.userId = user.id;
    res.cookie('user', user.name, { httpOnly: false });
    return res.json(user);
  } catch (e) {
    // TODO: distinguish between auth failure, network failure and other errors.
    console.log('Verification failed: ' + e.stack);
    return res.status(401).json({ error: e.message });
  }
});

router.post('/signout', async (req, res) => {
  await req.session.destroy()
  res.clearCookie('user', { httpOnly: false });
  res.send(200);
});

module.exports = {
  routerPath: '/auth',
  router: router
};