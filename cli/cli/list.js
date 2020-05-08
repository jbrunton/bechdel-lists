const { formatTimestamp, fetchBuilds, fetchDeployments } = require('../lib/utils');

module.exports = {
  flags: 'list <builds|deployments> [args]',
  ignore: ['<builds|deployments>', '[args]'],
  desc: 'List builds or deployments',
  setup: sywac => {
    sywac
      .command('builds', {
        desc: 'List available builds',
        run: async (argv, context) => {
          const catalog = await fetchBuilds();
          const builds = catalog.builds.map(build => {
            return {
              version: build.version,
              buildSha: build.buildSha,
              timestamp: formatTimestamp(build.timestamp),
            }
          });
          console.table(builds);
        }
      })
      .command('deployments <environment>', {
        desc: 'List deployments for the environment',
        run: async (argv, context) => {
          const deployments = await fetchDeployments(argv.environment);
          console.table(deployments.deployments.slice(0, 10).map(deployment => {
            return {
              version: deployment.version,
              timestamp: formatTimestamp(deployment.timestamp),
              id: deployment.id
            };
          }));
        }
      })
  }
};
