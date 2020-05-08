const fs   = require('fs');
const logger = require('./logger');

function writeOutput(file, content, dryRun) {
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
