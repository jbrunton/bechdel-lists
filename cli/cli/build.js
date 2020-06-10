const chalk = require('chalk');
const fs = require('fs');

const logger = require('../lib/logger');
const { writeOutput } = require('../lib/fs_utils');
const manifests = require('../lib/manifests');
const { spawn, exec } = require('../lib/child_process');

module.exports = {
  flags: 'build',
  desc: 'Create a new build for the current manifest version',
  run: async (argv, context) => {
    const buildVersion = await manifests.local.getManifestVersion();
    const dryRun = argv['dry-run'],
      skipBuild = argv['skip-build'],
      skipPush = argv['skip-push'];
    const imageTag = argv['image-tag'];

    console.log(`Starting build for ${buildVersion}`.bold);
    console.log(`dryRun: ${dryRun}, skipBuild: ${skipBuild}, skipPush: ${skipPush}`);

    const manifest = await manifests.local.getManifest();
    const buildManifest = await manifests.createBuild(buildVersion, dryRun, imageTag);
    const buildId = buildManifest.id;
    
    if (!skipBuild) {
      await spawn('npx cli docker-build all prod', { env: process.env });
    } else {
      logger.info('--skip-build passed, skipping docker builds');
    }
    if (!dryRun && !skipPush) {
      await spawn('npx cli docker-push all', { env: process.env });
    } else {
      const argName = dryRun ? 'dry-run' : 'skip-push';
      logger.info(`--${argName} passed, skipping docker push`);
    }

    //const buildConfig = await compose.config();
    const services = manifest.build.services;
    for (let service of services) {
      const imageName = `jbrunton/bechdel-lists-${service}`;
      console.log('process.cwd: ' + process.cwd());
      await exec(`kustomize edit set image ${imageName}=${imageName}:${build.imageTag}`, {
        env: process.env,
        cwd: `${process.cwd()}/k8s/prod`
      });
    }
    const result = await exec('kustomize build k8s/prod | kbld -f -');
    const buildConfig = result.stdout.trim();
    const buildFile = manifests.buildFilePath(buildId);
    writeOutput(buildFile, buildConfig, dryRun);

    console.log(`Completed build for ${buildVersion}`);
  },
  setup: sywac => {
    sywac
      .boolean('--skip-build', { desc: 'Skip the docker-compose build step' })
      .boolean('--skip-push', { desc: 'Skip the docker-compose push step' })
      .string('--image-tag', { desc: 'Use an existing docker image tag' });
  }
};
