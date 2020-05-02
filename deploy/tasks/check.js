const fs   = require('fs');
const argv = require('yargs').argv;
const manifest = require('../lib/manifest');
require('colors');

const outputEnvFile = argv['output-file'];
const dryRun = !!argv['dry-run'];

function writeOutput(content) {
  if (!dryRun) {
    console.log(`Writing output to ${outputEnvFile}`);
    fs.writeFileSync(outputEnvFile, `SKIP_BUILD=0\nMISSING_BUILDS=${missingBuilds.join(',')}\n`);
  } else {
    console.log('--dry-run passed, skipping output.');
    console.log(`Would have created ${outputEnvFile} with content:`);
    console.log(content);
  }
}

console.log('Checking for existing deployment files:'.bold)

if (!outputEnvFile) {
  console.log('Set --output-file to output the results for scripting.');
}

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

if (missingBuilds.length == 0) {
  if (outputEnvFile) {
    writeOutput('SKIP_BUILD=1\n');
  }
  console.log('Deployment files found for all environments, no build required.\n');
} else {
  if (outputEnvFile) {
    writeOutput(`SKIP_BUILD=0\nMISSING_BUILDS=${missingBuilds.join(',')}\n`);
  }
  console.log(`Missing deployment files for builds ${missingBuilds.join(', ')}.\n`);
}
