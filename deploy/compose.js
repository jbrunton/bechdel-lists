const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Compose {
  constructor(tag) {
    this.execOpts = {
      env: Object.assign({
        'TAG': tag,
        'COMPOSE_FILE': 'docker-compose.yml'
      }, process.env)
    };
  }

  async pull() {
    return await exec('docker-compose pull', this.execOpts);
  }

  async config() {
    return await exec('docker-compose config --resolve-image-digests | sed "s#$(pwd)/##"', this.execOpts);
  }
}

module.exports = Compose;
