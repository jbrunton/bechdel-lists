require('colors');

const manifest = require('../lib/manifest');
const { writeOutput } = require('../lib/fs_utils');
const args = require('../lib/args');

const outputFile = args.require('output-file');

console.log('Checking for build'.bold);
const buildExists = !!manifest.currentBuild;
const buildVersion = manifest.version;

if (buildExists) {
  console.log(`Found build for version ${buildVersion}: ${JSON.stringify(manifest.currentBuild)}`);
} else {
  console.log(`Build required for version ${buildVersion}.`);
}

if (buildExists) {
  writeOutput(outputFile, 'BUILD_REQUIRED=0');
} else {
  writeOutput(outputFile, `BUILD_REQUIRED=1`);
}
