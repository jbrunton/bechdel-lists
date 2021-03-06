const { exec, spawn } = require('./child_process');
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
  constructor(tag, buildVersion) {
    this.tag = tag;
    this.execOpts = {
      env: Object.assign({
        'TAG': this.tag,
        'COMPOSE_FILE': 'docker-compose.yml',
        'BUILD_VERSION': buildVersion
      }, process.env)
    };
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
    const yttCommand = 'ytt -f - -f ./ci/clean-config.yml';
    const kbldCommand = 'kbld -f - --images-annotation=false';
    const result = await exec(`docker-compose config | ${yttCommand} | ${kbldCommand}`, this.execOpts);
    const dockerFile = result.stdout;
    const config = removeBuildContexts(dockerFile);
    return config;
  }
}

module.exports = Compose;
