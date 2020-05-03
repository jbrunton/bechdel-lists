const fs = require('fs');
const yaml = require('js-yaml');
const git = require('simple-git/promise')();
const logger = require('../lib/logger');

const catalogPath = './deployments/builds/catalog.yml';
const catalog = yaml.safeLoad(fs.readFileSync(catalogPath, 'utf8'));

const buildsById = [];
const buildsByVersion = [];
for (let build of catalog.builds) {
  buildsById[build.id] = build;
  buildsByVersion[build.version] = build;
}

function buildFilePath(buildId) {
  return `./deployments/builds/docker-compose.${buildId}.yml`;
}

function createBuildId(version, buildSha, date) {
  return `${version}-${buildSha}-${date.getTime()}`;
}

function findById(buildId) {
  return buildsById[buildId];
}

function findByVersion(version) {
  return buildsByVersion[version];
}

async function create(version, dryRun, imageTag) {
  const buildSha = await git.revparse(['--short', 'HEAD']);
  const date = new Date();
  const buildId = createBuildId(version, buildSha, date);

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
    imageTag: imageTag || buildId,
    version: version,
    buildSha: buildSha,
    timestamp: date.toISOString()
  };

  catalog.builds.push(build);
  if (!dryRun) {
    fs.writeFileSync(catalogPath, yaml.safeDump(catalog));
    console.log('Added build to catalog.');
  } else {
    logger.info('--dry-run passed, skipping adding build to catalog');
    logger.info('Would have added:');
    logger.infoBlock(yaml.safeDump(build));
  }

  return build;
}

module.exports = {
  findById: findById,
  findByVersion: findByVersion,
  buildFilePath: buildFilePath,
  create: create
};
