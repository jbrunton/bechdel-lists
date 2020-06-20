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

// This is necessary because docker-compose evaluates all variables. To reinstate variables that we want to keep
// for deployment time, set them to ENV:VAR-NAME. E.g. if the variable $HOST is set to ENV:HOST, it will be reinstated
// as $HOST.
function reinstateEnvVars(config) {
  return config.replace(/ENV:(\w+)/g, function(match, p1) {
    console.log('match: ' + match);
    return `\$${p1}`
  });
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
    const result = await exec('docker-compose config --resolve-image-digests', this.execOpts);
    const dockerFile = result.stdout;
    const config = removeBuildContexts(reinstateEnvVars(dockerFile));
    return config;
  }
}

module.exports = Compose;
