#!/usr/bin/env node

const sywac = require('sywac');
const { TypeEnvironment } = require('./lib/types');

sywac
  .registerFactory('environment', opts => new TypeEnvironment(opts))
  .commandDirectory('./cli')
  .showHelpByDefault()
  .help('-h, --help')
  .style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
