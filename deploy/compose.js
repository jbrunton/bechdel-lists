const util = require('util');
const _exec = util.promisify(require('child_process').exec);
const exec = async function(cmd, options) {
  console.log('running ' + cmd);
  return await _exec(cmd, options);
};
const tmp = require('tmp');

class Compose {
  constructor(tag) {
    this.tag = tag;
  }

  async setup() {
    console.log('starting setup()')
    this.dir = tmp.dirSync();

    this.execOpts = {
      //cwd: this.dir.name,
      env: Object.assign({
        'TAG': this.tag,
        'COMPOSE_FILE': 'docker-compose.yml'
      }, process.env)
    };

    //const result = await exec(`git clone git@github.com:jbrunton/bechdel-demo.git ${this.dir.name}`, { env: process.env });
    console.log(`Cloned repo to ${this.dir.name}`);
  }

  cleanup() {
    console.log('Cleaning up tmp directory ' + this.dir.name);
    //this.dir.removeCallback();
    //this.dir = null;
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

  async pull() {
    const result = await exec('docker-compose pull', this.execOpts);
    console.log('stdout: ' + result.stdout);
    console.log('stderr: ' + result.stderr);
    return result;
  }

  async config() {
    console.log('starting config()');
    const result = await exec('docker-compose config --resolve-image-digests | sed "s#$(pwd)/##"', this.execOpts);
    console.log('completed config()');
    return result;
  }
}

module.exports = Compose;
