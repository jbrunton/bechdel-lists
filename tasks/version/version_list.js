const logger = require('../lib/logger');
const builds = require('../lib/builds');
const args = require('../lib/args');

const MAX_BUILDS = 10;

const showAll = args.boolean('all');
if (!showAll) {
  logger.info(`Showing ${MAX_BUILDS} most recent builds. Pass --all to show all.`);
}

const sortedBuilds = [...builds.catalog.builds].sort(build => -Date.parse(build.timestamp));
const buildsToShow = showAll ? sortedBuilds : sortedBuilds.slice(0, MAX_BUILDS);
buildsToShow.forEach((build, index) => {
  logger.log(`${index}: ${build.version} (commit: ${build.buildSha}, time: ${new Date(build.timestamp).toLocaleString()})`);
});
