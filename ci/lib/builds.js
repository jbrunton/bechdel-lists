const fs = require('fs');
const yaml = require('js-yaml');

const catalogPath = './deployments/builds/catalog.yml';
const catalog = yaml.safeLoad(fs.readFileSync(catalogPath, 'utf8'));

const buildsById = [];
const buildsByVersion = [];
for (let build of catalog.builds) {
  buildsById[build.id] = build;
  buildsByVersion[build.version] = build;
}

function buildFileFor(buildId) {
  return `./deployments/builds/docker-compose.${buildId}.yml`;
}

module.exports = {
  findById(buildId) {
    return buildsById[buildId];
  },

  findByVersion(version) {
    return buildsByVersion[version];
  },

  buildFileFor: buildFileFor,

  create(buildId, version, dryRun) {
    if (buildsById[buildId]) {
      console.log(`Build with id ${buildId} already exists.`.red);
      process.exit(1);
    }

    if (buildsByVersion[version]) {
      console.log(`Build for version ${version} already exists.`.red);
      process.exit(1);
    }

    const build = {
      id: buildId,
      version: version
      // TODO: add timestamp
    };

    catalog.builds.push(build);
    if (!dryRun) {
      fs.writeFileSync(catalogPath, yaml.safeDump(catalog));
    }

    return build;
  }
};
