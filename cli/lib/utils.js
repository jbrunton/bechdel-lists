const axios = require('axios');
const yaml = require('js-yaml');
const Table = require('cli-table3');
const chalk = require('chalk');

module.exports = {
  formatTimestamp: formatTimestamp,
  formatTable: formatTable,
  fetchManifest: fetchManifest,
  fetchBuilds: fetchBuilds,
  fetchDeployments: fetchDeployments
};

function formatTimestamp(timestamp) {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  return new Date(timestamp).toLocaleString('en', options);
}

const defaultTableStyles = {
  compact: true,
  head: [],
  paddingLeft: 2,
  paddingRight: 2,
  border: ['black']
};

function formatTable(data, styles, options) {
  const header = Object.keys(data[0]).map(s => ({ hAlign: 'center', content: s }));
  const rows = data.map(x => {
    return Object.values(x).map((v, index) => {
      return index == 0 ? chalk.green(v) : chalk.yellow(v);
    });
  });
  const colAligns = {};
  header.forEach((col, index) => {
    if (col.content == 'version') {
      colAligns[index] = 'right';
    }
  });
  const table = new Table(Object.assign({
    head: header,
    style: Object.assign(defaultTableStyles, styles),
    colAligns: colAligns
  }, options));
  table.push(...rows);
  return table.toString();
}

async function fetchManifest() {
  const manifestUrl = 'https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/manifest.yml';
  const manifestFile = await axios.get(manifestUrl);
  const manifest = yaml.safeLoad(manifestFile.data);
  return manifest;
}

async function fetchDeployments(environment) {
  const manifestUrl = `https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/deployments/${environment}.yml`;
  const manifestFile = await axios.get(manifestUrl);
  const manifest = yaml.safeLoad(manifestFile.data);
  return manifest;
}

async function fetchBuilds() {
  const manifestUrl = `https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/deployments/builds/catalog.yml`;
  const manifestFile = await axios.get(manifestUrl);
  const manifest = yaml.safeLoad(manifestFile.data);
  return manifest;
}
