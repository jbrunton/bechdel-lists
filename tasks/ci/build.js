const fs   = require('fs');
require('colors');

const args = require('../lib/args');
const logger = require('../lib/logger');
const builds = require('../lib/builds');
const Compose = require('../lib/compose');
const { writeOutput } = require('../lib/fs_utils');
const manifest = require('../lib/manifest');

const dryRun = args.boolean('dry-run');
const skipBuild = args.boolean('skip-build');
const skipPush = args.boolean('skip-push');
const imageTag = args.argv['image-tag'];

const buildVersion = manifest.version;

(async function build() {
  console.log(`Starting build for ${buildVersion}`.bold);

  const build = await builds.create(buildVersion, dryRun, imageTag);
  const buildId = build.id;
  const compose = new Compose(build.imageTag);
  
  if (!skipBuild) {
    await compose.build(logger.dockerLogger);
  } else {
    console.log('--skip-build passed, skipping docker-compose build'.yellow);
  }
  if (!dryRun && !skipPush) {
    await compose.push(logger.dockerLogger);
  } else {
    const argName = dryRun ? 'dry-run' : 'skip-push';
    console.log(`--${argName} passed, skipping docker-compose push`.yellow);
  }

  const buildConfig = await compose.config();
  const buildFile = builds.buildFilePath(buildId);
  writeOutput(buildFile, buildConfig);

  console.log(`Completed build for ${buildVersion}`);
})();
