const Type = require('sywac/types/type')
const chalk = require('chalk');
const cache = require('./manifest_cache');

class TypeEnvironment extends Type {
  get datatype () {
    return 'environment';
  }
  async validateValue (value) {
    const manifest = await cache.getManifest(true);
    const environments = Object.keys(manifest.environments);
    return environments.includes(value);
  }
  buildInvalidMessage (context, msgAndArgs) {
    super.buildInvalidMessage(context, msgAndArgs);
    const manifest = cache.getCachedManifest(true);
    const environments = Object.keys(manifest.environments);
    msgAndArgs.msg += ` Valid options: ${environments.map(e => chalk.green.inverse(e)).join(', ')}.`;
  }
}

module.exports = {
  TypeEnvironment: TypeEnvironment
};
