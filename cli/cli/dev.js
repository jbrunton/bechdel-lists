const { spawn } = require('../lib/child_process');
const manifests = require('../lib/manifests');

module.exports = {
  flags: 'dev <service>',
  desc: 'Run a local service using Telepresence',
  params: [
    { type: 'service', strict: true }
  ],
  setup: sywac => {
    sywac
      .array('-v, --volumes v1 v2 ..', {
        desc: 'Specify one or more volumes'
      })
      .array('-p, --ports p1 p2 ..', {
        desc: 'Specify one or more ports to expose'
      })
      .string('-c --command', {
        desc: 'Specify the command to run in the container'
      })
      .boolean('--run', { desc: 'Run the service as a container' })
  },
  run: async (argv, context) => {
    const dryRun = argv['dry-run'];
    
    const service = argv.service;
    const manifest = await manifests.local.getServiceManifest(service);
    const volumes = argv.volumes.length > 0 ? argv.volumes : manifest?.build?.dev?.volumes || [];
    const volumeArgs = volumes.map(volume => `-v ${volume}`).join(' ');
    const ports = argv.ports.length > 0 ? argv.ports : manifest?.build?.dev?.ports || [];
    const portArgs = ports.map(port => `-p ${port}`).join(' ');
    const containerCommand = argv.command || manifest?.build?.dev?.command;
    const commandBuilder = [
      'telepresence --swap-deployment',
      `${service}-deployment`,
      `--env-file services/${service}/telepresence.env`
    ]
    if (argv.run) {
      commandBuilder.push(`--docker-run --rm ${volumeArgs} ${portArgs} bechdel-lists-${service}:latest ${containerCommand}`);
    } else {
      commandBuilder.push(`--method inject-tcp`);
    }
    const command = commandBuilder.join(' ');

    if (!dryRun) {
      await spawn(command, { env: process.env });
    } else {
      console.log('--dry-run passed, skipping task. Would have run:');
      console.log(command);
    }
  }
};
