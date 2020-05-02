const fs   = require('fs');
require('colors');

const manifest = require('../lib/manifest');
const { writeOutput } = require('../lib/fs_utils');
const logger = require('../lib/logger');
const args = require('../lib/args');

const envName = args.require('environment');
const outputEnvFile = args.require('output-file');

console.log('Checking builds for environment'.bold);

const envProperties = manifest.environments[envName];
envProperties.name = envName;
logger.log('Environment:'.yellow);
logger.log(JSON.stringify(envProperties).yellow, { indent: true });


const deploymentFile = envProperties.deploymentFile;
const buildId = envProperties.buildId;
const envDescription = `${envName.yellow} (${buildId})`
const buildExists = fs.existsSync(deploymentFile);
if (buildExists) {
  console.log(`  Environment ${envDescription} - ${' OK'.green}`);
} else {
  console.log(`  Environment ${envDescription} - ${'missing'.yellow}`);
}

console.log('');

if (buildExists) {
  writeOutput(outputEnvFile, 'BUILD_REQUIRED=0');
  console.log(`Build found for environment ${envName}, no build required.\n`);
} else {
  writeOutput(outputEnvFile, `BUILD_REQUIRED=1\nBUILD_ID=${buildId}`);
  console.log(`Build required for id ${buildId}.\n`);
}
