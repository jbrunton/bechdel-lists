const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const db = require('./models');

const app = express();
app.use(bodyParser.json());
const port = 5000;

const isNullOrEmpty = (value) => value === null || value === '';

const movieRepository = {
  findByImdbId: async(imdbId) => {
    var movie = await db.Movie.findOne({ where: { imdbId: imdbId } })
    if (movie == null) {
      const result = await axios.get(`http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid=${imdbId}`)
      const movieDetails = result.data
      movie = await db.Movie.create({
        title: movieDetails.title,
        imdbId: movieDetails.imdbid,
        rating: movieDetails.rating,
        year: movieDetails.year
      })
    }
    return movie;
  }
}

//db.init();

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/search', async (req, res) => {
  const query = req.query['query'];
  const results = await axios.get(`http://bechdeltest.com/api/v1/getMoviesByTitle?title=${query}`)
  const movies = results.data.map((movie) => {
    return {
      title: movie.title,
      imdbId: movie.imdbid,
      year: movie.year,
      rating: movie.rating
    };
  });
  res.json(movies)
});

app.get('/lists', async (req, res) => {
  const lists = await db.List.findAll();
  res.json(lists);
});

const trySave = async (object, res) => {
  try {
    await object.save();
    res.json(object);
  } catch (e) {
    if (db.isValidationError(e)) {
      res.status(422).json(e.errors)
    } else {
      console.log(e);
      res.status(500)
    }
  }
}

app.post('/lists', async (req, res) => {
  const title = req.body.title;
  const list = await db.List.build({ title: title });
  trySave(list, res);
});

app.get('/lists/:id', async (req, res) => {
  const list = await db.List.findByPk(req.params.id, { include: [db.Movie] });
  if (list != null) {
    res.json(list);
  } else {
    res.send(404)
  }
});

app.delete('/lists/:id', async (req, res) => {
  const list = await db.List.findByPk(req.params.id, { include: [db.Movie] });
  if (list != null) {
    await list.destroy();
    res.send(200)
  } else {
    res.send(404)
  }
});

app.post('/lists/:listId/movies/:imdbId', async (req, res) => {
  const list = await db.List.findByPk(req.params.listId)
  if (list != null) {
    const movie = await movieRepository.findByImdbId(req.params.imdbId);
    await list.addMovie(movie)
    await list.updateDetails();
    res.send(200);  
  } else {
    res.send(404);
  }
});

app.delete('/lists/:listId/movies/:imdbId', async (req, res) => {
  const list = await db.List.findByPk(req.params.listId)
  if (list != null) {
    const movie = await db.Movie.findOne({ where: { imdbId: req.params.imdbId } })
    if (movie != null) {
      list.removeMovie(movie);
      await list.updateDetails();
      res.send(200);
    }
  } else {
    res.send(404);
  }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
