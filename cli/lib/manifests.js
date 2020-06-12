const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const git = require('simple-git/promise')();
const { v4: uuid } = require('uuid');

const logger = require('./logger');

const manifestPath = 'manifest.yml';
const buildsCatalogPath = 'deployments/builds/catalog.yml';
const deploymentsCatalogPath = environment => `deployments/${environment}.yml`;
const serviceManifestpath = service => `services/${service}/manifest.yml`;

class ManifestCache {
  constructor(remote) {
    this._remote = remote;
    this._cache = [];
  }

  async getManifest() {
    return await this._cacheLookup(manifestPath);
  }

  async getManifestVersion() {
    const manifest = await this.getManifest();
    return manifest.version;
  }

  async getBuildsCatalog() {
    return await this._cacheLookup(buildsCatalogPath);
  }

  async getDeploymentsCatalog(environment) {
    return await this._cacheLookup(deploymentsCatalogPath(environment));
  }

  async findBuild(version) {
    const catalog = await this.getBuildsCatalog();
    return catalog.builds.find(build => build.version == version)
  }

  async getCurrentBuild() {
    const manifest = await this.getManifest();
    return this.findBuild(manifest.version);
  }

  async getLatestDeployment(environment) {
    const catalog = await this.getDeploymentsCatalog(environment);
    return catalog.deployments.find(deployment => deployment.id == catalog.latest);
  }

  async getServiceManifest(service) {
    const manifest = await await this._cacheLookup(serviceManifestpath(service));
    return manifest;
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

const remoteCache = new ManifestCache(true);
const localCache = new ManifestCache(false);

module.exports = {
  remote: remoteCache,
  local: localCache,
  manifestPath: manifestPath,
  buildsCatalogPath: buildsCatalogPath,
  deploymentsCatalogPath: deploymentsCatalogPath,
  createBuild: createBuild,
  createDeployment, createDeployment,
  buildFilePath: buildFilePath
};

async function loadRemoteYaml(path) {
  const url = `https://raw.githubusercontent.com/jbrunton/bechdel-demo/list-197/${path}`;
  const response = await axios.get(url);
  return yaml.safeLoad(response.data);
}

function loadLocalYaml(path) {
  return yaml.safeLoad(fs.readFileSync(`./${path}`, 'utf8'));
}

async function createBuild(version, dryRun, imageTag) {
  const buildSha = await git.revparse(['--short', 'HEAD']);
  const buildId = `${version}-${uuid()}`;

  if (await localCache.findBuild(version)) {
    throw new Error(`Build for version ${version} already exists.`);
  }

  const build = {
    id: buildId,
    version: version,
    buildSha: buildSha,
    imageTag: imageTag || buildId,
    timestamp: (new Date()).toISOString()
  };

  const catalog = await localCache.getBuildsCatalog();
  catalog.builds.unshift(build);
  if (!dryRun) {
    fs.writeFileSync(buildsCatalogPath, yaml.safeDump(catalog));
    console.log('Added build to catalog.');
  } else {
    logger.info('--dry-run passed, skipping adding build to catalog');
    logger.info('Would have added:');
    logger.infoBlock(yaml.safeDump(build));
  }

  return build;
}

async function createDeployment(environment, version, dryRun) {
  const deployment = {
    id: uuid(),
    version: version,
    timestamp: new Date().toISOString()
  };
  
  const catalog = await localCache.getDeploymentsCatalog(environment);
  catalog.deployments.unshift(deployment);
  catalog.latest = deployment.id;
  if (!dryRun) {
    fs.writeFileSync(deploymentsCatalogPath(environment), yaml.safeDump(catalog));
    console.log('Added build to catalog.');
  } else {
    logger.info('--dry-run passed, skipping adding deployment to catalog. Would have added:');
    logger.infoBlock(yaml.safeDump(deployment));
  }

  return deployment;
}

function buildFilePath(buildId) {
  return `./deployments/builds/build.${environment}.${buildId}.yml`
}
