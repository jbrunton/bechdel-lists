const yaml = require('js-yaml');
const git = require('simple-git/promise')();
const fs = require('fs');
const semver = require('semver');

const args = require('../lib/args');
const logger = require('../lib/logger');
const { writeOutput } = require('../lib/fs_utils');

const dryRun = args.boolean('dry-run');

function releaseType() {
  if (args.boolean('major')) {
    return 'major';
  }
  if (args.boolean('minor')) {
    return 'minor';
  };
  if (args.boolean('patch')) {
    return 'patch';
  }

  logger.error('Release type required, pass one of --major, --minor, --patch');
  process.exit(1);
}

async function bump() {

  const manifest = yaml.safeLoad(fs.readFileSync('./manifest.yml', 'utf8'));
  const currentVersion = manifest.version;
  const nextVersion = semver.inc(currentVersion, releaseType());
  manifest.version = nextVersion;

  console.info(`Current manifest version is ${currentVersion}, next version is ${nextVersion}.`);

  manifest.version = nextVersion;
  writeOutput('./manifest.yml', yaml.safeDump(manifest));

  const filesToAdd = ['./manifest.yml'];
  const commitMessage = `Updated version to ${nextVersion}`;

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

bump();
