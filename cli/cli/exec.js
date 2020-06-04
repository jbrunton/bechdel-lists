const { spawn, exec } = require('../lib/child_process');

module.exports = {
  flags: 'exec <service> ',
  desc: 'Execute a command in a container',
  params: [
    { type: 'service', strict: true }
  ],
  run: async (argv, context) => {
    const dryRun = argv['dry-run'];    
    const service = argv.service;
    console.log(JSON.stringify(argv))
    const result = await exec(`kubectl get pods | grep -m1 ${service}-deployment | awk '{ print $1 }'`);
    const deployment = result.stdout.trim();
    const command = `kubectl exec ${deployment} ${argv['_'].join(' ')}`;

    if (!dryRun) {
      await spawn(command, process.env)
    } else {
      console.log('--dry-run passed, skipping task. Would have run:');
      console.log(command);
    }
  }
};
