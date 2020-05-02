const argv = require('yargs').argv;

function requireArg(argName) {
  const value = argv[argName];
  if (!value) {
    console.log(`Missing required parameter --${argName}`.red);
    process.exit(64);
  }
  return value;
}

module.exports = {
  argv: argv,
  
  require: requireArg,

  boolean(argName) {
    return !!argv[argName];
  },

  requireBoolean(argName) {
    return !!requireArg(argName);
  }
}
