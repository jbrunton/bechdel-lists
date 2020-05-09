const defaults = require('./jest.config');

module.exports = Object.assign({
  testMatch: [
    "**/tests/unit/**/*.js?(x)"
  ]
}, defaults);
