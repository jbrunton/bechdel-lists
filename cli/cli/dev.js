const { spawn } = require('../lib/child_process');
const manifests = require('../lib/manifests');

module.exports = {
  flags: 'dev <service>',
  desc: 'Run a local service using Telepresence',
  params: [
    { type: 'service', strict: true }
  ],
  setup: sywac => {
    sywac.array('-v, --volumes v1 v2 ..', {
      desc: 'Specify one or more volumes'
    })
  },
  run: async (argv, context) => {
    const dryRun = argv['dry-run'];
    
    const service = argv.service;
    const manifest = await manifests.local.getServiceManifest(service);
    const volumes = argv.volumes.length > 0 ? argv.volumes : manifest?.build?.dev?.volumes || [];
    const volumeArgs = volumes.map(volume => `-v ${volume}`).join(' ');
    const command = [
      'telepresence --swap-deployment',
      `${service}-deployment`,
      `--docker-run --rm ${volumeArgs} bechdel-lists-${service}:latest`
    ].join(' ');

    if (!dryRun) {
      await spawn(command, process.env)
    } else {
      console.log('--dry-run passed, skipping task. Would have run:');
      console.log(command);
    }
  }
};
