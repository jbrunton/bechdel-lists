const fs = require('fs');
const yaml = require('js-yaml');

class Deployments {
  constructor(environment) {
    this.environment = environment;
    this.loadManifest();
  }

  loadManifest() {
    this.manifest = yaml.safeLoad(fs.readFileSync(`./deployments/${this.environment}.yml`, 'utf8'));

    this._deploymentsById = [];
    for (let deployment of this.manifest.deployments) {
      this._deploymentsById[deployment.id] = deployment;
    }
  }

  getLatest() {
    return this._deploymentsById[this.manifest.latest];
  }
}

module.exports = Deployments;
