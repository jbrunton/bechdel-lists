#!/usr/bin/env node

console.log('hi from cli');

const sywac = require('sywac');
const axios = require('axios');
const yaml = require('js-yaml');

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
        const deployments = await fetchDeployments(argv.environment);
        const latestDeployment = deployments.deployments.find(deployment => deployment.id == deployments.latest);
        console.table({
          version: environment.version,
          deployed: new Date(latestDeployment.timestamp).toLocaleString(),
          host: environment.host
        });
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
