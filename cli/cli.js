#!/usr/bin/env node

const sywac = require('sywac');
const { TypeEnvironment, TypeVersion, TypeService, TypeBuildTarget } = require('./lib/types');

try {
  sywac
    .registerFactory('environment', opts => new TypeEnvironment(opts))
    .registerFactory('version', opts => new TypeVersion(opts))
    .registerFactory('service', opts => new TypeService(opts))
    .registerFactory('build-target', opts => new TypeBuildTarget(opts))
    .commandDirectory('./cli')
    .showHelpByDefault()
    .help('-h, --help')
    .style(require('./lib/style'));
} catch(e) {
  console.log(e);
  process.exit(1);
}

async function main() {
  await sywac.parseAndExit();
}

main();
