#!/usr/bin/env node

const sywac = require('sywac');
const { TypeEnvironment, TypeVersion } = require('./lib/types');

sywac
  .registerFactory('environment', opts => new TypeEnvironment(opts))
  .registerFactory('version', opts => new TypeVersion(opts))
  .commandDirectory('./cli')
  .showHelpByDefault()
  .help('-h, --help')
  .style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
