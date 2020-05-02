const fs   = require('fs');
require('colors');

const args = require('../lib/args');
const logger = require('../lib/logger');
const manifest = require('../lib/manifest');
const Compose = require('../lib/compose');
const { writeOutput } = require('../lib/fs_utils');

const buildId = args.require('build-id')
const outputEnvFile = args.require('output-file');
const dryRun = args.boolean('dry-run');
const skipBuild = args.boolean('skip-build');

async function build() {
  console.log(`Starting build for ${buildId}`.bold);
  
  const compose = new Compose(buildId);
  try {
    await compose.setup();
    if (!skipBuild) {
      await compose.build(logger.dockerLogger);
    } else {
      console.log('--skip-build passed, skipping docker-compose build');
    }
    if (!dryRun) {
      await compose.push(logger.dockerLogger);
    } else {
      console.log('--dry-run passed, skipping docker-compose push');
    }

    const deploymentConfig = await compose.config();
    const deploymentFile = manifest.deploymentFileFor(buildId);
    writeOutput(deploymentFile, deploymentConfig);
    writeOutput(outputEnvFile, `DEPLOYMENT_FILE=${deploymentFile}`);
    
    await compose.cleanup();
  }
  catch (e) {
    await compose.cleanup();
    console.log(e);
    process.exit(1);
  }

  console.log(`Completed build for ${buildId}`);
}


build();
