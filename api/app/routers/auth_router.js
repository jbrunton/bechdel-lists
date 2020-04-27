const express = require('express');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

const clientId = '952635847674-ocr6762iqhjkvtb988fclnfs4trr6qqr.apps.googleusercontent.com';

const client = new OAuth2Client(clientId);

router.post('/auth/signin', async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.idToken + 'd',
      audience: clientId,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log('Verification successful: ' + payload);
    res.json(payload);
  } catch (e) {
    console.log('Verification failed: ' + e);
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
