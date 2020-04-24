const express = require('express');
const axios = require('axios');
const db = require('./db');

const app = express()
const port = 5000

const isEmpty = (value) => value === null || value === '';

db.init();

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/search', async (req, res) => {
  const query = req.query['query'];
  const results = await axios.get(`http://bechdeltest.com/api/v1/getMoviesByTitle?title=${query}`)
  res.json(results.data)
});

app.get('/lists', async (req, res) => {
  const values = await db.query('SELECT * from lists');
  res.json(values.rows);
});

app.post('/lists', async (req, res) => {
  const title = req.body.title;
  // if (isNullOrEmpty(title)) {

  // }
  
  const result = db.query('INSERT INTO lists(title) VALUES($1) RETURNING *', [title]);

  res.json(result.rows[0])
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
