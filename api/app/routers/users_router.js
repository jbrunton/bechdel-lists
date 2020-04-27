const express = require('express');

const router = express.Router();

router.get('/users/me', async (req, res) => {
  res.json({ name: 'My Name', email: 'my.email@example.com' });
});

module.exports = router;