const { exec, spawn } = require('../lib/child_process');
const manifests = require('../lib/manifests');

module.exports = {
  flags: 'dev <container>',
  desc: 'Run a local container using Telepresence',
  params: [
    { type: 'container', strict: true }
  ],
  setup: sywac => {
    sywac.array('-v, --volumes v1 v2 ..', {
      desc: 'Specify one or more volumes'
    })
  },
  run: async (argv, context) => {
    const dryRun = argv['dry-run'];
    
    const container = argv.container;
    const manifest = await manifests.local.getServiceManifest(container);
    const volumes = argv.volumes.length > 0 ? argv.volumes : manifest?.build?.dev?.volumes || [];
    const volumeArgs = volumes.map(volume => `-v ${volume}`).join(' ');
    const command = [
      'telepresence --swap-deployment',
      `${container}-deployment`,
      `--docker-run --rm ${volumeArgs} bechdel-lists-${container}:latest`
    ].join(' ');

    if (!dryRun) {
      await spawn(command, process.env)
    } else {
      console.log('--dry-run passed, skipping task. Would have run:');
      console.log(command);
    }
  }
};
