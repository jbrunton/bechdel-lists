const fs   = require('fs');
const argv = require('yargs').argv;
require('colors');
const logger = require('./logger');

function writeOutput(file, content) {
  const dryRun = !!argv['dry-run'];
  if (!dryRun) {
    console.log(`Writing output to ${file}`);
    fs.writeFileSync(file, content + '\n');
  } else {
    logger.log('--dry-run passed, skipping output.'.yellow);
    logger.log(`Would have created ${file} with content:`.yellow);
    logger.write(content.yellow, { indent: true });
    logger.log('');
  }
}

module.exports = {
  writeOutput: writeOutput
};
