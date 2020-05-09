const defaults = require('./jest.config');

module.exports = Object.assign({
  testMatch: [
    "**/tests/integration/**/*.js?(x)"
  ]
}, defaults);
