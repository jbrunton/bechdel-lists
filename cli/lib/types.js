const Type = require('sywac/types/type')
const chalk = require('chalk');
const semver = require('semver');
const manifests = require('./manifests');

class TypeService extends Type {
  get datatype () {
    return 'service';
  }
  async validateValue (value) {
    const manifest = await manifests.local.getManifest();
    this._services = manifest.build.services;
    return this._services.includes(value);
  }
  buildInvalidMessage (context, msgAndArgs) {
    super.buildInvalidMessage(context, msgAndArgs);
    msgAndArgs.msg += ` Valid options: ${this._services.map(e => chalk.green.inverse(e)).join(', ')}.`;
  }
}

class TypeEnvironment extends Type {
  get datatype () {
    return 'environment';
  }
  async validateValue (value) {
    const manifest = await manifests.remote.getManifest();
    this._environments = Object.keys(manifest.environments);
    return this._environments.includes(value);
  }
  buildInvalidMessage (context, msgAndArgs) {
    super.buildInvalidMessage(context, msgAndArgs);
    msgAndArgs.msg += ` Valid options: ${this._environments.map(e => chalk.green.inverse(e)).join(', ')}.`;
  }
}

class TypeVersion extends Type {
  get datatype () {
    return 'version';
  }
  async validateValue (value) {
    this._validSemver = value == 'latest' || semver.valid(value);
    if (!this._validSemver) {
      return false;
    }

    const catalog = await manifests.remote.getBuildsCatalog();
    const build = catalog.builds.find(build => build.version == value);
    this._buildExists = build != null;

    return this._buildExists;
  }
  buildInvalidMessage (context, msgAndArgs) {
    super.buildInvalidMessage(context, msgAndArgs);
    if (!this._validSemver) {
      msgAndArgs.msg += ` Versions should be in semver format or "latest".`;
    } else if (!this._buildExists) {
      msgAndArgs.msg += ` Could not find build for that version name.`;
      console.log(JSON.stringify(msgAndArgs));
    }
  }
}

module.exports = {
  TypeEnvironment: TypeEnvironment,
  TypeVersion: TypeVersion,
  TypeService: TypeService
};
