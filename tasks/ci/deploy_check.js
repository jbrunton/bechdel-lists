const fs   = require('fs');
require('colors');

const manifest = require('../lib/manifest');
const { writeOutput } = require('../lib/fs_utils');
const logger = require('../lib/logger');
const args = require('../lib/args');
const { exec } = require('../lib/child_process');

const envName = args.require('environment');
const outputEnvFile = args.require('output-file');

console.log('Checking deployment status for environment'.bold);

const envProperties = manifest.environments[envName];
envProperties.name = envName;
logger.log('Environment:'.yellow);
logger.log(JSON.stringify(envProperties).yellow, { indent: true });

async function check() {
  const deploymentFile = envProperties.deploymentFile;
  const result = await exec(`sha1sum ${deploymentFile} | awk '{ print $1 }'`, process.env);
  if (result.stderr) {
    console.log(result.stderr);
    process.exit(1);
  }

  const localSignature = result.stdout;
  console.log(`Deployment file signature is ${localSignature}`);
  console.log('');

  // if (buildExists) {
  //   writeOutput(outputEnvFile, 'BUILD_REQUIRED=0');
  //   console.log(`Build found for environment ${envName}, no build required.\n`);
  // } else {
  //   writeOutput(outputEnvFile, `BUILD_REQUIRED=1\nBUILD_ID=${buildId}`);
  //   console.log(`Build required for id ${buildId}.\n`);
  // }
}

check();
