const express = require('express');
const models = require.main.require('./models');
const { OAuth2Client } = require('google-auth-library');
const authenticate = require.main.require('./app/middleware/authenticate');
const listParam = require.main.require('./app/middleware/list_param');
const authorization = require.main.require('./app/usecases/authorization');


const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

const router = express.Router();
router.param('listId', listParam);

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

router.get('/authorize/list/:listId', authenticate, (req, res) => {
  const isOwner = authorization.isOwner(models.List, req);
  return res.json({ isOwner: isOwner });
});

module.exports = {
  routerPath: '/auth',
  router: router
};
