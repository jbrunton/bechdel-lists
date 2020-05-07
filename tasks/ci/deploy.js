const yaml = require('js-yaml');
const git = require('simple-git/promise')();
const fs = require('fs');
const semver = require('semver');

const args = require('../lib/args');
const logger = require('../lib/logger');
const { writeOutput } = require('../lib/fs_utils');

const dryRun = args.boolean('dry-run');
const version = args.require('deploy-version');
const envName = args.require('environment');

async function deploy() {
  const manifest = yaml.safeLoad(fs.readFileSync('./manifest.yml', 'utf8'));
  const environment = manifest.environments[envName];
  if (!environment) {
    logger.error(`Environment ${environment} is not defined in manifest.`);
  }

  if (environment.version) {
    console.info(`${envName} is on ${environment.version}, deploying ${version}.`);
  } else {
    console.info(`First time deploy for ${envName}, deploying ${version}.`);
  }

  environment.version = version;
  writeOutput('./manifest.yml', yaml.safeDump(manifest));

  const filesToAdd = ['./manifest.yml'];
  const commitMessage = `Updated ${envName} version to ${version}`;

  if (!dryRun) {
    try {
      await git.add(filesToAdd);
      await git.commit(commitMessage);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  } else {
    logger.info('--dry-run passed, skipping commit.');
    logger.info(`Would have added files with commit message "${commitMessage}":`);
    logger.infoBlock(filesToAdd.join('\n'));
  }
}

deploy();
