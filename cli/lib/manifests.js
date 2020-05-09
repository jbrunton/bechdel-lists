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

  async getBuildsCatalog() {
    return await this._cacheLookup(buildsPath);
  }

  async getDeploymentsCatalog(environment) {
    return await this._cacheLookup(deploymentsPath(environment));
  }

  async findBuild(version) {
    const catalog = await this.getBuildsCatalog();
    return catalog.builds.find(build => build.version == version)
  }

  async getCurrentBuild() {
    const manifest = await this.getManifest();
    return this.findBuild(manifest.version);
  }

  async getLatestDeployment() {
    const catalog = await this.getDeploymentsCatalog();
    return catalog.deployments.find(deployment => deployment.id == catalog.latest);
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

function buildFilePath(version) {
  return `./deployments/builds/docker-compose.${buildId}.yml`
}
