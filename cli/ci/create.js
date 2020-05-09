const chalk = require('chalk');

const logger = require('../lib/logger');
const Compose = require('../lib/compose');
const { writeOutput } = require('../lib/fs_utils');
const manifests = require('../lib/manifests');

module.exports = {
  flags: 'create <subcommand> [args]',
  ignore: ['<subcommand>', '[args]'],
  setup: sywac => {
    sywac
      .command('build', {
        desc: 'Create a new build for the current manifest version',
        run: async (argv, context) => {
          const buildVersion = manifests.local.getManifest().version;
          const dryRun = argv['dry-run'],
            skipBuild = argv['skip-build'],
            skipPush = argv['skip-push'];
          const imageTag = argv['image-tag'];

          console.log(`Starting build for ${buildVersion}`.bold);
          console.log(`dryRun: ${dryRun}, skipBuild: ${skipBuild}, skipPush: ${skipPush}`);

          const build = await manifests.createBuild(buildVersion, dryRun, imageTag);
          const buildId = build.id;
          const compose = new Compose(build.imageTag);
          
          if (!skipBuild) {
            await compose.build(logger.dockerLogger);
          } else {
            logger.info('--skip-build passed, skipping docker-compose build');
          }
          if (!dryRun && !skipPush) {
            await compose.push(logger.dockerLogger);
          } else {
            const argName = dryRun ? 'dry-run' : 'skip-push';
            logger.info(`--${argName} passed, skipping docker-compose push`);
          }

          const buildConfig = await compose.config();
          const buildFile = manifests.buildFilePath(buildId);
          writeOutput(buildFile, buildConfig, dryRun);

          console.log(`Completed build for ${buildVersion}`);
        }
      })
      .boolean('--skip-build', { desc: 'Skip the docker-compose build step' })
      .boolean('--skip-push', { desc: 'Skip the docker-compose push step' })
      .string('--image-tag', { desc: 'Use an existing docker image tag' });
  }
};
