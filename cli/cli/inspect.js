const chalk = require('chalk');

const { formatTimestamp, formatTable } = require('../lib/utils');
const manifests = require('../lib/manifests');

module.exports = {
  flags: 'inspect <environment>',
  desc: 'Display information about the environment',
  params: [
    { type: 'environment', strict: true }
  ],
  run: async (argv, context) => {
    const manifest = await manifests.remote.getManifest();
    const environment = manifest.environments[argv.environment];
    if (!environment) {
      throw new Error(`Unknown environment ${argv.environment}`);
    }

    console.log(chalk.bold('Environment info'));
    const catalog = await manifests.remote.getDeploymentsCatalog(argv.environment);
    console.log(formatTable([{
      version: environment.version,
      host: environment.host
    }]));

    console.log(chalk.bold('Recent deployments'));
    const deploymentInfo = catalog.deployments.slice(0, 5).map(deployment => {
      return {
        version: deployment.version,
        timestamp: formatTimestamp(deployment.timestamp),
        id: deployment.id
      };
    });
    console.log(formatTable(deploymentInfo));
  }
}