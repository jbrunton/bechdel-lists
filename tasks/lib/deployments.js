const fs = require('fs');
const yaml = require('js-yaml');
const { v4: uuid } = require('uuid');
const logger = require('../lib/logger');

class Deployments {
  constructor(environment) {
    this.environment = environment;
    this.loadManifest();
  }

  loadManifest() {
    this.manifestFile = `./deployments/${this.environment}.yml`;
    this.manifest = yaml.safeLoad(fs.readFileSync(this.manifestFile, 'utf8'));

    this._deploymentsById = [];
    for (let deployment of this.manifest.deployments) {
      this._deploymentsById[deployment.id] = deployment;
    }
  }

  getLatest() {
    return this._deploymentsById[this.manifest.latest];
  }

  create(version, dryRun) {
    const deployment = {
      id: uuid(),
      version: version,
      timestamp: new Date().toISOString()
    };
    
    this.manifest.deployments.push(deployment);
    if (!dryRun) {
      fs.writeFileSync(this.manifestFile, yaml.safeDump(this.manifest));
      console.log('Added build to catalog.');
    } else {
      logger.info('--dry-run passed, skipping adding deployment to manifest');
      logger.info('Would have added:');
      logger.infoBlock(yaml.safeDump(deployment));
    }

    return deployment;
  }
}

module.exports = Deployments;
