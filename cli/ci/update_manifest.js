const { writeOutput } = require('../lib/fs_utils');
const logger = require('../lib/logger');
const git = require('simple-git/promise')();
const yaml = require('js-yaml');
const fs = require('fs');

module.exports = {
  flags: 'update-manifest <version> [environment]',
  run: async (argv, context) => {
    const envName = argv.environment;
    const nextVersion = argv.version;
    const dryRun = argv['dry-run'];
    const manifest = yaml.safeLoad(fs.readFileSync('./manifest.yml', 'utf8'));

    const currentVersion = manifest.version;
    if (currentVersion != nextVersion) {
      console.log(`Current version is ${currentVersion}, updating to ${nextVersion}`);
      manifest.version = nextVersion;
    }

    if (envName) {
      const envManifest = manifest.environments[envName];
      const currentVersion = envManifest.version;
      console.log(`Current version of ${envName} is ${currentVersion}, updating to ${nextVersion}`);
      envManifest.version = nextVersion;
    }

    writeOutput('./manifest.yml', yaml.safeDump(manifest), dryRun);

    const filesToAdd = ['./manifest.yml'];
    const commitMessage = `Updated ${envName || 'version'} to ${nextVersion}`;

    if (!dryRun) {
      await git.add(filesToAdd);
      await git.commit(commitMessage);
    } else {
      logger.info('--dry-run passed, skipping commit.');
      logger.info(`Would have added files with commit message "${commitMessage}":`);
      logger.infoBlock(filesToAdd.join('\n'));
    }
  }
}
