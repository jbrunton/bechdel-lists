const glob = require('glob');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: 'debug secret'
}));
app.use(morgan('dev'));

console.log('Configuring routers...');
glob.sync('./app/routers/*_router.js').forEach(function(file) {
  const { routerPath, router, environments } = require(path.resolve(file));
  const applyRouter = !environments || environments.includes(process.env.NODE_ENV);
  if (applyRouter) {
    console.log(`  Registering router ${file} at ${routerPath}`);
    app.use(routerPath, router);
  } else {
    console.log(`  Skipping router ${file} for environment ${process.env.NODE_ENV}`);
  }
});

module.exports = app;
