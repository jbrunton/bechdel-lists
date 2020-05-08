require('colors');

function indent(message) {
  return '  ' + message.replace(/\n/g, '\n  ');
}

function write(message, options) {
  process.stdout.write(options && options.indent ? indent(message) : message);
}

function log(message, options) {
  write(message + '\n', options);
}

function info(message, options) {
  log(message.yellow, options);
}

function infoBlock(message) {
  write(message.yellow, { indent: true });
  log('');
}

function error(message) {
  console.log(message.red);
}

const dockerLogger = {
  log(message) {
    write(message.yellow, { indent: true });
  }
}

module.exports = {
  dockerLogger: dockerLogger,
  write: write,
  log: log,
  info: info,
  infoBlock: infoBlock,
  error: error
}
