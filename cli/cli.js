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
        const latestDeployment = deployments.deployments.find(deployment => deployment.id == deployments.latest);
        console.table({
          version: environment.version,
          host: environment.host
        });

        console.log(colors.bold('Recent deployments'));
        console.table(deployments.deployments.slice(0, 5).map(deployment => {
          return {
            version: deployment.version,
            timestamp: new Date(deployment.timestamp).toLocaleString(),
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
.showHelpByDefault();

async function main() {
  await sywac.parseAndExit();
}

main();
