#!/usr/bin/env node

const sywac = require('sywac');
const axios = require('axios');
const yaml = require('js-yaml');
const colors = require('colors/safe');
const semver = require('semver');
const { exec } = require('child_process');
const chalk = require('chalk');

async function fetchManifest() {
  const manifestUrl = 'https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/manifest.yml';
  const manifestFile = await axios.get(manifestUrl);
  const manifest = yaml.safeLoad(manifestFile.data);
  return manifest;
}

async function fetchDeployments(environment) {
  const manifestUrl = `https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/deployments/${environment}.yml`;
  const manifestFile = await axios.get(manifestUrl);
  const manifest = yaml.safeLoad(manifestFile.data);
  return manifest;
}

async function fetchBuilds() {
  const manifestUrl = `https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/deployments/builds/catalog.yml`;
  const manifestFile = await axios.get(manifestUrl);
  const manifest = yaml.safeLoad(manifestFile.data);
  return manifest;
}

function formatTimestamp(timestamp) {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  return new Date(timestamp).toLocaleString('en', options);
}

sywac
  .command('info [environment]', {
    desc: 'Display information from the manifest',
    run: async (argv, context) => {
      const manifest = await fetchManifest();
      if (argv.environment) {
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
      } else {
        const envInfo = Object.entries(manifest.environments).map(([envName, envInfo]) => {
          return Object.assign({ name: envName }, envInfo);
        });
        console.table(envInfo, ['name', 'version', 'host']);
      }
    }
  })
  .command('list <subcommand> [args]', {
    ignore: ['<subcommand>', '[args]'],
    desc: 'List builds or deployments',
    setup: sywac => {
      sywac
        .command('builds', {
          desc: 'List available builds',
          run: async (argv, context) => {
            const catalog = await fetchBuilds();
            const builds = catalog.builds.map(build => {
              return {
                version: build.version,
                buildSha: build.buildSha,
                timestamp: new Date(build.timestamp).toLocaleString(),
              }
            });
            console.table(builds);
          }
        })
        .command('deployments <environment>', {
          desc: 'List deployments for the environment',
          run: async (argv, context) => {
            const deployments = await fetchDeployments(argv.environment);
            console.table(deployments.deployments.slice(0, 10).map(deployment => {
              return {
                version: deployment.version,
                timestamp: formatTimestamp(deployment.timestamp),
                id: deployment.id
              };
            }));
          }
        })
    }
  })
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
      
        return 'minor';
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
  .command('deploy <version> <environment>', {
    run: async (argv, context) => {
      const manifest = await fetchManifest();
      const currentVersion = manifest.environments[argv.environment].version;
      const nextVersion = argv.version;
      console.log(`currentVersion: ${currentVersion}, nextVersion: ${nextVersion}`);

      const payload = {
        ref: 'master',
        environment: 'update_manifest',
        task: 'update_manifest',
        description: 'New version',
        auto_merge: false,
        payload: { version: nextVersion, environment: argv.environment },
        required_contexts:[]
      };

      const command = `echo '${JSON.stringify(payload)}' | hub api "repos/jbrunton/bechdel-demo/deployments" --input -`;
      console.log('command: ' + command);
      await exec(command, process.env);
    }
  })
  .showHelpByDefault();

  sywac.style(require('./lib/style'));

async function main() {
  await sywac.parseAndExit();
}

main();
