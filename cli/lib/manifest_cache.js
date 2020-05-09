const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');

const cache = [];

module.exports = {
  getManifest: getManifest,
  getCachedManifest: getCachedManifest,
  getBuilds: getBuilds,
  getCachedBuilds: getCachedBuilds,
  getDeployments: getDeployments,
  getCachedDeployments: getCachedDeployments
};

const manifestPath = 'manifest.yml';
const buildsPath = 'deployments/builds/catalog.yml';
const deploymentsPath = environment => `deployments/${environment}.yml`;

async function getManifest(remote) {
  return await cacheLookup(remote, manifestPath);
}

function getCachedManifest(remote) {
  return cache[cacheKeyFor(remote, manifestPath)];
}

async function getBuilds(remote) {
  return await cacheLookup(remote, buildsPath);
}

function getCachedBuilds(remote) {
  return cache[cacheKeyFor(remote, buildsPath)];
}

async function getDeployments(environment, remote) {
  return await cacheLookup(remote, deploymentsPath(environment));
}

function getCachedDeployments(environment, remote) {
  return cache[cacheKeyFor(remote, deploymentsPath(environment))];
}

function cacheKeyFor(remote, path) {
  return (remote ? 'remote:' : 'local:') + path;
}

async function cacheLookup(remote, path) {
  const key = cacheKeyFor(remote, path);
  var yaml = cache[key];
  if (!yaml) {
    if (remote) {
      yaml = await loadRemoteYaml(path);
    } else {
      yaml = loadLocalYaml(path);
    }
  }
  cache[key] = yaml;
  return yaml;
}

async function loadRemoteYaml(path) {
  const url = `https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/${path}`;
  const response = await axios.get(url);
  return yaml.safeLoad(response.data);
}

function loadLocalYaml(path) {
  return yaml.safeLoad(fs.readFileSync(`./${path}`, 'utf8'));
}
