const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const db = require('./db');

const app = express();
app.use(bodyParser.json());
const port = 5000;

const isNullOrEmpty = (value) => value === null || value === '';

db.init();

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/search', async (req, res) => {
  const query = req.query['query'];
  const results = await axios.get(`http://bechdeltest.com/api/v1/getMoviesByTitle?title=${query}`)
  res.json(results.data)
});

app.get('/lists', async (req, res) => {
  const lists = await db.List.findAll();
  res.json(lists);
});

app.post('/lists', async (req, res) => {
  const title = req.body.title;

  if (isNullOrEmpty(title)) {
    res.status(422).json({
      error: 'required title'
    })
  }
  
  try {
    const result = await db.List.create({ title: title });
    res.json(result)
  } catch (e) {
    res.status(500).json({
      error: e.toString()
    })
  }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
