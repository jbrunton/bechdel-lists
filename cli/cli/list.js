const chalk = require('chalk');
const { formatTimestamp, formatTable } = require('../lib/utils');
const manifests = require('../lib/manifests');

module.exports = {
  flags: 'list <builds|deployments|environments> [args]',
  ignore: ['<builds|deployments|environments>', '[args]'],
  desc: 'List builds or deployments',
  setup: sywac => {
    sywac
      .command('builds', {
        desc: 'List available builds',
        run: async (argv, context) => {
          const catalog = await manifests.remote.getBuilds();
          const builds = catalog.builds.map(build => {
            return {
              version: build.version,
              buildSha: build.buildSha,
              timestamp: formatTimestamp(build.timestamp),
            }
          });
          console.log(formatTable(builds));
        }
      })
      .command('deployments <environment>', {
        desc: 'List deployments for the environment',
        params: [
          { type: 'environment', strict: true }
        ],
        run: async (argv, context) => {
          const deployments = await manifests.remote.getDeployments(argv.environment);
          const tableData = deployments.deployments.slice(0, 10).map(deployment => {
            return {
              version: deployment.version,
              timestamp: formatTimestamp(deployment.timestamp),
              id: deployment.id
            };
          });
          console.log(formatTable(tableData));
        }
      })
      .command('environments', {
        desc: 'List environments',
        run: async (argv, context) => {
          const manifest = await manifests.remote.getManifest();
          const tableData = Object.entries(manifest.environments).map(([envName, envInfo]) => {
            return {
              name: envName,
              version: envInfo.version,
              host: envInfo.host
            };
          });
          console.log(formatTable(tableData));
        }
      })
  }
};
