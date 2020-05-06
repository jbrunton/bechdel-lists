const git = require('simple-git/promise')();
const manifest = require('../lib/manifest');
const builds = require('../lib/builds');
const args = require('../lib/args');
const logger = require('../lib/logger');

const dryRun = args.boolean('dry-run');

(async function() {
  const build = manifest.currentBuild;

  if (!build) {
    console.log('Missing build for current manifest version');
    process.exit(1);
  }

  const buildFile = builds.buildFilePath(build.id);
  const filesToAdd = ['./deployments/builds/catalog.yml', buildFile];
  const commitMessage = `Generated build for ${build.version}`;

  if (!dryRun) {
    try {
      await git.add(filesToAdd);
      await git.commit(commitMessage);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  } else {
    logger.info('--dry-run passed, skipping commit.');
    logger.info(`Would have added files with commit message "${commitMessage}":`);
    logger.infoBlock(filesToAdd.join('\n'));
  }
})();
