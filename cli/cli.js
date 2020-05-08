#!/usr/bin/env node

const sywac = require('sywac');
const Type = require('sywac/types/type')
const chalk = require('chalk');
const { fetchManifest } = require('./lib/utils');

class TypeEnvironment extends Type {
  get datatype () {
    return 'environment';
  }
  async validateValue (value) {
    const manifest = await fetchManifest();
    this._environments = Object.keys(manifest.environments).concat('staging');
    return this._environments.includes(value);
  }
  buildInvalidMessage (context, msgAndArgs) {
    super.buildInvalidMessage(context, msgAndArgs);
    if (this._environments) {
      msgAndArgs.msg += ` Valid options: ${this._environments.map(e => chalk.green.inverse(e)).join(', ')}.`;
    }
  }
}

sywac
  .registerFactory('environment', opts => {
    console.log('environment used')
    return new TypeEnvironment(opts)
  })
  .commandDirectory('./cli')
  .showHelpByDefault()
  .style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
