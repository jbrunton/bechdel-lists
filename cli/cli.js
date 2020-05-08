#!/usr/bin/env node

const sywac = require('sywac');
const axios = require('axios');
const yaml = require('js-yaml');
const colors = require('colors/safe');

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
.showHelpByDefault();

async function main() {
  await sywac.parseAndExit();
}

main();
