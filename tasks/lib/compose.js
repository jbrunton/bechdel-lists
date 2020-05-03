const { exec, spawn } = require('./child_process');
const tmp = require('tmp');
const yaml = require('js-yaml');

function removeBuildContexts(config) {
  const configObject = yaml.safeLoad(config);
  for (let [_, serviceConfig] of Object.entries(configObject.services)) {
    if (serviceConfig.build) {
      delete serviceConfig.build;
    }
  }
  return yaml.safeDump(configObject);
}

class Compose {
  constructor(tag) {
    this.tag = tag;
    this.execOpts = {
      env: Object.assign({
        'TAG': this.tag,
        'COMPOSE_FILE': 'docker-compose.yml'
      }, process.env)
    };
  }

  async checkImages() {
    const servicesResult = await exec('docker-compose config --services', this.execOpts);
    const services = servicesResult.stdout.split("\n").filter((s) => s.length > 0);
    console.log('services: ' + JSON.stringify(services));
    var missingImages = [];
    for (const service of services) {
      try {
        await exec(`docker inspect --type=image jbrunton/bechdel-lists-${service}:${this.tag}`, this.execOpts);
      } catch (e) {
        missingImages.push(service);
      }
    }
    return missingImages;
  }

  async build(logger) {
    await spawn('docker-compose build', this.execOpts, logger);
  }

  async push(logger) {
    await spawn('docker-compose push', this.execOpts, logger);
  }

  async pull() {
    const result = await exec('docker-compose pull', this.execOpts);
    console.log('stdout: ' + result.stdout);
    console.log('stderr: ' + result.stderr);
    return result;
  }

  async config() {
    const result = await exec('docker-compose config --resolve-image-digests', this.execOpts);
    const dockerFile = result.stdout;
    const config = removeBuildContexts(dockerFile);
    return config;
  }
}

module.exports = Compose;
