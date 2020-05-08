#!/usr/bin/env node

const sywac = require('sywac');

sywac
  .commandDirectory('./cli')
  .showHelpByDefault()
  .style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
