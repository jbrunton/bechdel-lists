const fs   = require('fs');
require('colors');

const manifest = require('../lib/manifest');
const { writeOutput } = require('../lib/fs_utils');
const args = require('../lib/args');

const outputEnvFile = args.require('output-file');

console.log('Checking for build'.bold);
const buildExists = !!manifest.currentBuild;

if (buildExists) {
  writeOutput(outputEnvFile, 'BUILD_REQUIRED=0');
  console.log(`  Found build for version ${manifest.version}: ${JSON.stringify(manifest.currentBuild)}`);
} else {
  writeOutput(outputEnvFile, `BUILD_REQUIRED=1\nBUILD_ID=${buildId}`);
  console.log(`  Build required for version ${manifest.version}.`);
}
