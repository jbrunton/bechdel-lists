const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');

const manifestPath = 'manifest.yml';
const buildsPath = 'deployments/builds/catalog.yml';
const deploymentsPath = environment => `deployments/${environment}.yml`;

class ManifestCache {
  constructor(remote) {
    this._remote = remote;
    this._cache = [];
  }

  async getManifest() {
    return await this._cacheLookup(manifestPath);
  }

  async getBuilds() {
    return await this._cacheLookup(buildsPath);
  }

  async getDeployments(environment) {
    return await this._cacheLookup(deploymentsPath(environment));
  }

  async _cacheLookup(path) {
    var yaml = this._cache[path];
    if (!yaml) {
      if (this._remote) {
        yaml = await loadRemoteYaml(path);
      } else {
        yaml = loadLocalYaml(path);
      }
      this._cache[path] = yaml;
    }
    return yaml;
  }
}

module.exports = {
  remote: new ManifestCache(true),
  local: new ManifestCache(false),
  createBuild: createBuild,
  createDeployment, createDeployment
};

async function loadRemoteYaml(path) {
  const url = `https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/${path}`;
  const response = await axios.get(url);
  return yaml.safeLoad(response.data);
}

function loadLocalYaml(path) {
  return yaml.safeLoad(fs.readFileSync(`./${path}`, 'utf8'));
}

function createBuild(version) {

}

function createDeployment() {

}
