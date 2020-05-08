#!/usr/bin/env node

const sywac = require('sywac');

sywac
  .commandDirectory('./cli')
  .showHelpByDefault();

  sywac.style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
