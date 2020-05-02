const fs   = require('fs');
require('colors');

const args = require('../lib/args');
const logger = require('../lib/logger');
const builds = require('../lib/builds');
const Compose = require('../lib/compose');
const { writeOutput } = require('../lib/fs_utils');

const buildId = args.require('build-id');
const buildVersion = args.require('build-version');
const dryRun = args.boolean('dry-run');
const skipBuild = args.boolean('skip-build');
const skipPush = args.boolean('skip-push');

async function build() {
  console.log(`Starting build for ${buildVersion}`.bold);

  builds.create(buildId, buildVersion, dryRun);
  if (!dryRun) {
    console.log('Added build to catalog.');
  } else {
    console.log('--dry-run passed, skipping adding build to catalog'.yellow);
  }
  const compose = new Compose(buildId);
  try {
    await compose.setup();
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
    const buildFile = builds.buildFileFor(buildId);
    writeOutput(buildFile, buildConfig);
    
    await compose.cleanup();
  }
  catch (e) {
    await compose.cleanup();
    console.log(e);
    process.exit(1);
  }

  console.log(`Completed build for ${buildVersion}`);
}


build();
