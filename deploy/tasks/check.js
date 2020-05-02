const fs   = require('fs');
const argv = require('yargs').argv;
const manifest = require('../lib/manifest');
require('colors');

const outputEnvFile = argv['output-file'];
const dryRun = !!argv['dry-run'];

function writeOutput(content) {
  if (!dryRun) {
    console.log(`Writing output to ${outputEnvFile}`);
    fs.writeFileSync(outputEnvFile, content);
  } else {
    console.log('--dry-run passed, skipping output.');
    console.log(`Would have created ${outputEnvFile} with content:`);
    console.log('  ' + content.replace('\n', '\n  '));
  }
}

console.log('Checking for existing deployment files:'.bold)

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
    writeOutput('DEPLOYMENT_REQUIRED=false\n');
  }
  console.log('Deployment files found for all environments, no build required.\n');
} else {
  if (outputEnvFile) {
    writeOutput(`DEPLOYMENT_REQUIRED=true\nMISSING_BUILDS=${missingBuilds.join(',')}\n`);
  }
  console.log(`Missing deployment files for builds ${missingBuilds.join(', ')}.\n`);
}

if (!outputEnvFile) {
  console.log('Hint: set --output-file to output the results for scripting.');
}
