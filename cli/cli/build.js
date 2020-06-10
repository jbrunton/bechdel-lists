const logger = require('../lib/logger');
const { writeOutput } = require('../lib/fs_utils');
const manifests = require('../lib/manifests');
const { spawn, exec } = require('../lib/child_process');

module.exports = {
  flags: 'build',
  desc: 'Create a new build for the current manifest version',
  run: async (argv, context) => {
    console.log ('starting build');
    const buildVersion = await manifests.local.getManifestVersion();
    const dryRun = argv['dry-run'],
      skipBuild = argv['skip-build'],
      skipPush = argv['skip-push'];

    console.log(`Starting build for ${buildVersion}`.bold);
    console.log(`dryRun: ${dryRun}, skipBuild: ${skipBuild}, skipPush: ${skipPush}`);

    const manifest = await manifests.local.getManifest();
    const buildManifest = await manifests.createBuild(buildVersion, dryRun, argv['image-tag']);
    const buildId = buildManifest.id;
    const imageTag = buildManifest.imageTag;
    
    if (!skipBuild) {
      const buildEnv = Object.assign({ 'TAG': imageTag, 'BUILD_VERSION': buildVersion }, process.env);
      await spawn('npx cli docker-build all prod', { env: buildEnv });
    } else {
      logger.info('--skip-build passed, skipping docker builds');
    }
    if (!dryRun && !skipPush) {
      const pushEnv = Object.assign({ 'TAG': imageTag }, process.env);
      await spawn('npx cli docker-push all prod', { env: pushEnv });
    } else {
      const argName = dryRun ? 'dry-run' : 'skip-push';
      logger.info(`--${argName} passed, skipping docker push`);
    }

    const services = manifest.build.services;
    for (let service of services) {
      const imageName = `jbrunton/bechdel-lists-${service}`;
      await exec(`kustomize edit set image ${imageName}=${imageName}:${imageTag}`, {
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
