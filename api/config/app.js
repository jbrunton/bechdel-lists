const glob = require('glob');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: 'debug secret'
}));

console.log('Configuring routers...');
glob.sync('./app/routers/*_router.js').forEach(function(file) {
  console.log(`  Registering router at ${file}`);
  const router = require(path.resolve(file));
  app.use(router);
});

module.exports = app;
