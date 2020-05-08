#!/usr/bin/env node

const sywac = require('sywac');
const axios = require('axios');
const yaml = require('js-yaml');
const colors = require('colors/safe');
const semver = require('semver');
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
  .command('new-version [version]', {
    run: async (argv, context) => {
      function releaseType() {
        if (argv.major) {
          return 'major';
        }
        if (argv.minor) {
          return 'minor';
        };
        if (argv.patch) {
          return 'patch';
        }
      
        throw new Error("Version or --major, --minor, -patch required.");
      }
      const manifest = await fetchManifest();
      const currentVersion = manifest.version;
      const nextVersion = argv.version ? argv.version : semver.inc(currentVersion, releaseType());
      console.log(`currentVersion: ${currentVersion}, nextVersion: ${nextVersion}`);

      const payload = {
        ref: 'master',
        environment: 'update_manifest',
        task: 'update_manifest',
        description: 'New version',
        auto_merge: false,
        payload: { version: nextVersion },
        required_contexts:[]
      };

      const command = `echo '${JSON.stringify(payload)}' | hub api "repos/jbrunton/bechdel-demo/deployments" --input -`;
      console.log('command: ' + command);
      await exec(command, process.env);
    },
    setup: sywac => {
      sywac 
        .boolean('--major')
        .boolean('--minor')
        .boolean('--patch')
    }
  })
  .command(require('./cli/deploy'))
  .showHelpByDefault();

  sywac.style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
