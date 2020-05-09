const { table } = require('table');
const Table = require('cli-table3');
const chalk = require('chalk');
const { formatTimestamp, fetchBuilds, fetchDeployments, fetchManifest } = require('../lib/utils');

const defaultConfig = {
  drawHorizontalLine: (index, size) => [0, 1, size].includes(index),
  columnDefault: {
    paddingLeft: 2,
    paddingRight: 2
  }
};

const defaultStyles = {
  compact: true,
  head: [],
  paddingLeft: 2,
  paddingRight: 2,
  border: ['black']
};

function printTable(data, styles, options) {
  const header = Object.keys(data[0]).map(s => ({ hAlign: 'center', content: s }));
  const rows = data.map(x => {
    return Object.values(x).map((v, index) => {
      return index == 0 ? chalk.green(v) : chalk.yellow(v);
    });
  });
  const table = new Table(Object.assign({
    head: header,
    style: Object.assign(defaultStyles, styles)
  }, options));
  table.push(...rows);
  console.log(table.toString());
}

module.exports = {
  flags: 'list <builds|deployments|environments> [args]',
  ignore: ['<builds|deployments|environments>', '[args]'],
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
          printTable(builds, null, { colAligns: ['right'] });
        }
      })
      .command('deployments <environment>', {
        desc: 'List deployments for the environment',
        params: [
          { type: 'environment', strict: true }
        ],
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
      .command('environments', {
        desc: 'List environments',
        run: async (argv, context) => {
          const manifest = await fetchManifest();
          const envInfo = Object.entries(manifest.environments).map(([envName, envInfo]) => {
            return Object.assign({ name: envName }, envInfo);
          });
          console.table(envInfo, ['name', 'version', 'host']);
        }
      })
  }
};
