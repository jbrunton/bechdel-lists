const Git = require('simple-git/promise');
const manifest = require('../lib/manifest');
const builds = require('../lib/builds');
const args = require('../lib/args');
const logger = require('../lib/logger');

const dryRun = args.boolean('dry-run');

const git = Git();


(async function() {
  const build = manifest.currentBuild;
  const buildFile = builds.buildFilePath(build.id);
  const filesToAdd = ['./deployments/builds/catalog.yml', buildFile];
  const commitMessage = `Generated build for ${build.version} (${build.id})`;

  if (!dryRun) {
    await git.add(filesToAdd);
    await git.commit();
  } else {
    logger.info('--dry-run passed, skipping commit.');
    logger.info(`Would have added files with commit message "${commitMessage}":`);
    logger.infoBlock(filesToAdd.join('\n'));
  }
})();
