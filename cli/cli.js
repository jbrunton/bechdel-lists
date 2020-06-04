#!/usr/bin/env node

const sywac = require('sywac');
const { TypeEnvironment, TypeVersion, TypeContainer } = require('./lib/types');

sywac
  .registerFactory('environment', opts => new TypeEnvironment(opts))
  .registerFactory('version', opts => new TypeVersion(opts))
  .registerFactory('container', opts => new TypeContainer(opts))
  .commandDirectory('./cli')
  .showHelpByDefault()
  .help('-h, --help')
  .style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
