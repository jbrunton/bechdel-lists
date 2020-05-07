#!/usr/bin/env node

const sywac = require('sywac');

if (!process.env.CI) {
  console.log("This script is intended to be run on a CI environment. Set CI=1 to override.");
  process.exit(1);
}

sywac.command('check manifest', {
  desc: 'Check for any builds required',
  run: async (argv, context) => {
    const buildMatrix = {
      include: [
        { version: '0.12.0' }
      ]
    }
    const deploymentMatrix = {
      include: [
        { environment: 'production', version: '0.11.1' },
      ]
    };
    console.log(`::set-output name=buildMatrix::${JSON.stringify(buildMatrix)}}"`);
    console.log(`::set-output name=deploymentMatrix::${JSON.stringify(deploymentMatrix)}}"`);
  }
})

sywac.showHelpByDefault();

async function main() {
  await sywac.parseAndExit();
}

main();
