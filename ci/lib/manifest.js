const fs = require('fs');
const yaml = require('js-yaml');
const builds = require('./builds');

const manifest = yaml.safeLoad(fs.readFileSync('./manifest.yml', 'utf8'));

for (let [_, envProperties] of Object.entries(manifest.environments)) {
  const build = builds.findByVersion(envProperties.version);
  envProperties.build = build;
}

manifest.currentBuild = builds.findByVersion(manifest.version);

module.exports = manifest;
