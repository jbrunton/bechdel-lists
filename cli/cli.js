#!/usr/bin/env node

const sywac = require('sywac');
const axios = require('axios');
const yaml = require('js-yaml');
const colors = require('colors/safe');

const { exec } = require('child_process');
const chalk = require('chalk');


sywac
  .command('info <environment>', {
    desc: 'Display information from the manifest',
    run: async (argv, context) => {
      const manifest = await fetchManifest();
      const environment = manifest.environments[argv.environment];
      if (!environment) {
        throw new Error(`Unknown environment ${argv.environment}`);
      }

      console.log(colors.bold('Environment info'));
      const deployments = await fetchDeployments(argv.environment);
      console.table({
        version: environment.version,
        host: environment.host
      });

      console.log(colors.bold('Recent deployments'));
      console.table(deployments.deployments.slice(0, 5).map(deployment => {
        return {
          version: deployment.version,
          timestamp: formatTimestamp(deployment.timestamp),
          id: deployment.id
        };
      }));    
    }
  })
  .command(require('./cli/list'))
  .command(require('./cli/new_version'))
  .command(require('./cli/deploy'))
  .showHelpByDefault();

  sywac.style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
