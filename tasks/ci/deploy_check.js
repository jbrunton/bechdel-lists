const fs   = require('fs');
require('colors');

const manifest = require('../lib/manifest');
const Deployments = require('../lib/deployments');
const builds = require('../lib/builds');
const { writeOutput } = require('../lib/fs_utils');
const logger = require('../lib/logger');
const args = require('../lib/args');

const envName = args.require('environment');
const outputFile = args.require('output-file');

console.log('Checking deployment status for environment'.bold);

const envManifest = manifest.environments[envName];
logger.info('Environment: ' + JSON.stringify(envManifest));

const deployments = new Deployments(envName);
const latestDeployment = deployments.getLatest();
logger.info('Latest deployment: ' + JSON.stringify(latestDeployment));

console.log(`Manifest version for ${envName} is ${envManifest.version}, latest deployed version is ${latestDeployment.version}`);
if (envManifest.version != latestDeployment.version) {
  const build = builds.findByVersion(envManifest.version);
  const buildFile = builds.buildFilePath(build.id);
  console.log('Deployed version out of date, deployment required.');
  writeOutput(outputFile, `DEPLOYMENT_REQUIRED=1\nBUILD_FILE=${buildFile}\nHOST=${envManifest.host}`);
} else {
  console.log('Versions match, skipping deployment');
  writeOutput(outputFile, 'DEPLOYMENT_REQUIRED=0');
}
