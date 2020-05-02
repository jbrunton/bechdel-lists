const fs   = require('fs');
const argv = require('yargs').argv;
const manifest = require('../lib/manifest');
require('colors');
const { writeOutput } = require('../lib/fs_utils');

console.log('Checking for existing deployment files:'.bold)

const outputEnvFile = argv['output-file'];
const missingBuilds = [];

for (let [envName, envProperties] of Object.entries(manifest.environments)) {
  const deploymentFile = envProperties.deploymentFile;
  const buildId = envProperties.buildId;
  const envDescription = `${envName.yellow} (${buildId})`
  if (fs.existsSync(deploymentFile)) {
    console.log(`  Environment ${envDescription} - ${' OK'.green}`);
  } else {
    console.log(`  Environment ${envDescription} - ${'missing'.yellow}`);
    missingBuilds.push(buildId);
  }
}

console.log('');

if (missingBuilds.length == 0) {
  if (outputEnvFile) {
    writeOutput(outputEnvFile, 'DEPLOYMENT_REQUIRED=0');
  }
  console.log('Deployment files found for all environments, no build required.\n');
} else {
  if (outputEnvFile) {
    writeOutput(outputEnvFile, `DEPLOYMENT_REQUIRED=1\nBUILD_IDS=${missingBuilds.join(',')}`);
  }
  console.log(`Missing deployment files for builds ${missingBuilds.join(', ')}.\n`);
}

if (!outputEnvFile) {
  console.log('Hint: set --output-file to output the results for scripting.');
}
