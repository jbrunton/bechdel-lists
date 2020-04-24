const express = require('express');
const axios = require('axios');

const app = express()
const port = 5000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/search', async (req, res) => {
    const query = req.query['query'];
    console.log('/search: ' + JSON.stringify(req.query));
    const results = await axios.get(`http://bechdeltest.com/api/v1/getMoviesByTitle?title=${query}`)
    res.json(results.data)
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
