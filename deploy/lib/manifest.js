const fs = require('fs');
const yaml = require('js-yaml');

const manifest = yaml.safeLoad(fs.readFileSync('./manifest.yml', 'utf8'));

for (let [_, envProperties] of Object.entries(manifest.environments)) {
  const buildId = envProperties.build.sha
  envProperties.buildId = buildId;
  envProperties.deploymentFile = `./deployments/docker-compose.${buildId}.yml`;  
}

module.exports = manifest;
