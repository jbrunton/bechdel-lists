const fs   = require('fs');
const args = require('./args');
require('colors');
const logger = require('./logger');

function writeOutput(file, content) {
  const dryRun = args.boolean('dry-run');
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
