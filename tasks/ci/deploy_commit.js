const git = require('simple-git/promise')();
const manifest = require('../lib/manifest');
const Deployments = require('../lib/deployments');
const args = require('../lib/args');
const logger = require('../lib/logger');

const envName = args.require('environment');
const dryRun = args.boolean('dry-run');

(async function() {
  const deployments = new Deployments(envName);
  console.log(JSON.stringify(manifest));
  const envManifest = manifest.environments[envName];
  const build = envManifest.build;

  if (!build) {
    console.log('Missing build for current manifest version');
    process.exit(1);
  }

  const deployment = deployments.updateLatest(build.version, dryRun);

  const filesToAdd = [deployments.manifestFile];
  const commitMessage = `Deploying ${build.version} to ${envName}`;

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
