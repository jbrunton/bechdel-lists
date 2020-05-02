const fs = require('fs');
const yaml = require('js-yaml');

const catalog = yaml.safeLoad(fs.readFileSync('./deployments/builds/catalog.yml', 'utf8'));

const buildsById = [];
const buildsByVersion = [];
for (let build of catalog.builds) {
  buildsById[build.id] = build;
  buildsByVersion[build.version] = build;
  build.deploymentFile = deploymentFileFor(build.id);
}

function deploymentFileFor(buildId) {
  return `./deployments/builds/docker-compose.${buildId}.yml`;
}

module.exports = {
  findBuildById(buildId) {
    return buildsById[buildId];
  },

  findBuildByVersion(version) {
    return buildsByVersion[version];
  }
};
