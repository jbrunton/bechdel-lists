require('colors');

const manifest = require('../lib/manifest');
const { writeOutput } = require('../lib/fs_utils');
const args = require('../lib/args');
const builds = require('../lib/builds');

const outputEnvFile = args.require('output-file');

console.log('Checking for build'.bold);
const buildExists = !!manifest.currentBuild;
const buildVersion = manifest.version;
const buildFile = builds.buildFileFor(buildVersion);

if (buildExists) {
  console.log(`Found build for version ${buildVersion}: ${JSON.stringify(manifest.currentBuild)}`);
} else {
  console.log(`Build required for version ${buildVersion}.`);
}

if (buildExists) {
  writeOutput(outputEnvFile, 'BUILD_REQUIRED=0');
} else {
  writeOutput(outputEnvFile, `BUILD_REQUIRED=1\nBUILD_VERSION=${buildVersion}\nBUILD_FILE=${buildFile}`);
}