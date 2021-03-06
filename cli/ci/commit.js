const git = require('simple-git/promise')();

const logger = require('../lib/logger');
const manifests = require('../lib/manifests');

module.exports = {
  flags: 'commit <subcommand>',
  ignore: ['<subcommand>'],
  setup: sywac => {
    sywac
      .command('build', {
        desc: 'Commit changes to the build catalog',
        run: async (argv, context) => {
          const dryRun = argv['dry-run'];
          const build = await manifests.local.getCurrentBuild();

          if (!build) {
            throw new Error('Missing build for current manifest version');
          }

          const buildFile = manifests.buildFilePath(build.id);
          const filesToAdd = [manifests.buildsCatalogPath, buildFile];
          const commitMessage = `Generated build for ${build.version}`;

          if (!dryRun) {
            await git.add(filesToAdd);
            await git.commit(commitMessage);
          } else {
            logger.info('--dry-run passed, skipping commit.');
            logger.info(`Would have added files with commit message "${commitMessage}":`);
            logger.infoBlock(filesToAdd.join('\n'));
          }
        }
      })
      .command('deployment <environment>', {
        desc: 'Commit changes to the deployment manifest',
        run: async (argv, context) => {
          const envName = argv.environment;
          const dryRun = argv['dry-run'];
          const deployments = await manifests.local.getDeploymentsCatalog(envName);
          const manifest = await manifests.local.getManifest();
          const envManifest = manifest.environments[envName];
          const build = await manifests.local.findBuild(envManifest.version);
        
          if (!build) {
            throw new Error('Missing build for current manifest version');
          }
        
          await manifests.createDeployment(envName, build.version, dryRun);

          const filesToAdd = [manifests.manifestPath, manifests.deploymentsCatalogPath(envName)];
          const commitMessage = `Deploying ${build.version} to ${envName}`;
        
          if (!dryRun) {
            await git.add(filesToAdd);
            await git.commit(commitMessage);
          } else {
            logger.info('--dry-run passed, skipping commit.');
            logger.info(`Would have added files with commit message "${commitMessage}":`);
            logger.infoBlock(filesToAdd.join('\n'));
          }
        }
      });
  }
};
