const axios = require('axios');
const yaml = require('js-yaml');

module.exports = {
  formatTimestamp: formatTimestamp,
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
