const defaults = require('./jest.config');

module.exports = Object.assign({
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/tests/integration/**/*.js?(x)"
  ],

  // A path to a module which exports an async function that is triggered once before all test suites
  globalSetup: './tests/global_setup.js',

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./tests/suite_setup.js']
}, defaults);
