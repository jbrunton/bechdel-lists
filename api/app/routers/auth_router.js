const express = require('express');
const axios = require('axios');
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
    res.json(payload);
  } catch (e) {
    console.log('Verification failed: ' + e);
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
