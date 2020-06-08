const { spawn } = require('../lib/child_process');
const manifests = require('../lib/manifests');
const docker = require('../lib/docker');

module.exports = {
  flags: 'docker-push <image|all> [args]',
  ignore: ['<image|all>', '[args]'],
  setup: sywac => {
    sywac
      .command({
        flags: 'image <service> <build-target>',
        desc: 'Pushes a docker image for the specified service',
        params: [
          { type: 'service', strict: true },
          { type: 'build-target', strict: true }
        ],
        run: async (argv, context) => {
          const dryRun = argv['dry-run'];
          const service = argv.service;
          const buildTarget = argv['build-target'];
        
          const imageTag = docker.generateTag(service, buildTarget, process.env.TAG);          
          const command = `docker push ${imageTag}`;

          if (!dryRun) {
            await spawn(command, { env: process.env });
          } else {
            console.log('--dry-run passed, skipping task. Would have run:');
            console.log(command);
          }
        }
      })
      .command({
        flags: 'all <build-target>',
        desc: 'Pushes docker images for all services for the given build target',
        params: [
          { type: 'build-target', strict: true }
        ],
        run: async (argv, context) => {
          const dryRun = argv['dry-run'];
          const manifest = await manifests.local.getManifest();
          const services = manifest.build.services;
          for (let service of services) {
            const command = `npx cli docker-push image ${service} ${argv['build-target']} ${dryRun ? '--dry-run' : ''}`;
            await spawn(command, { env: process.env });
          }
        }
      });
  }
};
