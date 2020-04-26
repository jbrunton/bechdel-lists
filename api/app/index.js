const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const db = require('../models');

const app = express();
app.use(bodyParser.json());

const search = require('./routers/search');
const lists = require('./routers/lists');
app.use(search);
app.use(lists);

module.exports = app;
