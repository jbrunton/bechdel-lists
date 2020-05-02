const fs = require('fs');
const yaml = require('js-yaml');

const manifest = yaml.safeLoad(fs.readFileSync('./manifest.yml', 'utf8'));

function deploymentFileFor(buildId) {
  return `./deployments/docker-compose.${buildId}.yml`;
}

for (let [_, envProperties] of Object.entries(manifest.environments)) {
  const buildId = envProperties.build.sha
  envProperties.buildId = buildId;
  envProperties.deploymentFile = deploymentFileFor(buildId);  
}

manifest.deploymentFileFor = deploymentFileFor;

module.exports = manifest;
