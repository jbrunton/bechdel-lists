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
    logger.info('--dry-run passed, skipping output.');
    logger.info(`Would have created ${file} with content:`);
    logger.infoBlock(content);
  }
}

module.exports = {
  writeOutput: writeOutput
};
