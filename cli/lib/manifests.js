const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');

const manifestPath = 'manifest.yml';
const buildsCatalogPath = 'deployments/builds/catalog.yml';
const deploymentsCatalogPath = environment => `deployments/${environment}.yml`;

class ManifestCache {
  constructor(remote) {
    this._remote = remote;
    this._cache = [];
  }

  async getManifest() {
    return await this._cacheLookup(manifestPath);
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

const remoteCache = new ManifestCache(true);
const localCache = new ManifestCache(false);

module.exports = {
  remote: remoteCache,
  local: localCache,
  createBuild: createBuild,
  createDeployment, createDeployment,
  buildFilePath: buildFilePath
};

async function loadRemoteYaml(path) {
  const url = `https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/${path}`;
  const response = await axios.get(url);
  return yaml.safeLoad(response.data);
}

function loadLocalYaml(path) {
  return yaml.safeLoad(fs.readFileSync(`./${path}`, 'utf8'));
}

async function createBuild(version, dryRun, imageTag) {
  const buildSha = await git.revparse(['--short', 'HEAD']);
  const buildId = `${version}-${uuid()}`;

  if (localCache.findBuild(version)) {
    throw new Error(`Build for version ${version} already exists.`);
  }

  const build = {
    id: buildId,
    version: version,
    buildSha: buildSha,
    imageTag: imageTag || buildId,
    timestamp: (new Date()).toISOString()
  };

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

function createDeployment(version, dryRun) {
  const deployment = {
    id: uuid(),
    version: version,
    timestamp: new Date().toISOString()
  };
  
  const catalog = localCache.getDeploymentsCatalog();
  catalog.deployments.unshift(deployment);
  catalog.latest = deployment.id;
  if (!dryRun) {
    fs.writeFileSync(deploymentsCatalogPath, yaml.safeDump(catalog));
    console.log('Added build to catalog.');
  } else {
    logger.info('--dry-run passed, skipping adding deployment to catalog. Would have added:');
    logger.infoBlock(yaml.safeDump(deployment));
  }

  return deployment;
}

function buildFilePath(version) {
  return `./deployments/builds/docker-compose.${buildId}.yml`
}
