#!/usr/bin/env node

const sywac = require('sywac');

if (!process.env.CI) {
  console.log("This script is intended to be run on a CI environment. Set CI=1 to override.");
  process.exit(1);
}

sywac
  .command(require('./ci/generate'))
  .command(require('./ci/create'))
  .command(require('./ci/commit'))
  .command(require('./ci/update_manifest'))
  .boolean('--dry-run', {
    desc: "Prevent saving, committing or pushing any changes."
  })
  .style(require('./lib/style'))
  .showHelpByDefault();

async function main() {
  await sywac.parseAndExit();
}

main();
