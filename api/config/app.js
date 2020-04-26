const express = require('express');
const bodyParser = require('body-parser');
const glob = require('glob');
const path = require('path');

const app = express();
app.use(bodyParser.json());

glob.sync('./app/routers/*_router.js').forEach(function(file) {
  console.log(`Registering router at ${file}`);
  const router = require(path.resolve(file));
  app.use(router);
});

module.exports = app;
