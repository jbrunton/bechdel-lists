const fs   = require('fs');
const argv = require('yargs').argv;
const manifest = require('../lib/manifest');
require('colors');
const { writeOutput } = require('../lib/fs_utils');
const logger = require('../lib/logger');

const envName = argv.environment;
if (!envName) {
  console.log('Missing required parameter --environment'.red);
  process.exit(64);
}

const outputEnvFile = argv['output-file'];

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
  if (outputEnvFile) {
    writeOutput(outputEnvFile, 'BUILD_REQUIRED=0');
  }
  console.log(`Build found for environment ${envName}, no build required.\n`);
} else {
  if (outputEnvFile) {
    writeOutput(outputEnvFile, `BUILD_REQUIRED=1\nBUILD_ID=${buildId}`);
  }
  console.log(`Build required for id ${buildId}.\n`);
}

if (!outputEnvFile) {
  console.log('Hint: set --output-file to output the results for scripting.');
}
