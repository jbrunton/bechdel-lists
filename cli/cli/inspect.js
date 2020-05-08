const { fetchManifest, fetchDeployments, formatTimestamp } = require('../lib/utils');
const chalk = require('chalk');

module.exports = {
  flags: 'inspect',
  desc: 'Display information about the environment',
  setup: sywac => {
    sywac.positional('<environment>', { type: 'environment', strict: true });
  },
  run: async (argv, context) => {
    const manifest = await fetchManifest();
    const environment = manifest.environments[argv.environment];
    if (!environment) {
      throw new Error(`Unknown environment ${argv.environment}`);
    }

    console.log(chalk.bold('Environment info'));
    const deployments = await fetchDeployments(argv.environment);
    console.table({
      version: environment.version,
      host: environment.host
    });

    console.log(chalk.bold('Recent deployments'));
    console.table(deployments.deployments.slice(0, 5).map(deployment => {
      return {
        version: deployment.version,
        timestamp: formatTimestamp(deployment.timestamp),
        id: deployment.id
      };
    }));    
  }
}