const axios = require('axios');
const yaml = require('js-yaml');

const { exec } = require('../lib/child_process');
const args = require('../lib/args');
const logger = require('../lib/logger');

const dryRun = args.boolean('dry-run');
const envName = args.require('environment');
const version = args.argv['deploy-version'];
const latest = args.boolean('latest');

async function getVersion() {
  const catalogPath = 'https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/deployments/builds/catalog.yml';
  const catalogFile = await axios.get(catalogPath);
  const catalog = yaml.safeLoad(catalogFile.data);
  const sortedBuilds = [...(catalog.builds)].sort(build => Date.parse(build.timestamp));

  if (version) {
    const build = sortedBuilds.find(build => build.version == version);
    if (build) {
      return version;
    } else {
      console.log('2')
      logger.error(`Version ${version} does not exist in catalog.`);
      process.exit(1);
    }
  }

  if (latest) {
    if (sortedBuilds.length == 0) {
      logger.error('Empty catalog.');
      process.exit(1);
    }
    return sortedBuilds[0].version;  
  }

  logger.info("Version required. Please specify with --version or --latest.");
  process.exit(1);
}

async function triggerDeploy() {
  const version = await getVersion();
  const payload = {
    ref: "master",
    environment: "ci-run",
    task: "ci:deploy",
    description: "Trigger ci:deploy",
    payload: {
      args: `--deploy-version '${version}' --environment ${envName}`
    },
    required_contexts: []
  };

  try {
    const command = `echo '${JSON.stringify(payload)}' | hub api "repos/jbrunton/bechdel-demo/deployments" --input -`;
    if (!dryRun) {
      await exec(command, { env: process.env });
    } else {
      logger.info('--dry-run passed, skipping deployment.');
      logger.info('Would have run:');
      logger.info('  ' + command);
    }
  } catch(e) {
    console.log(e);
    process.exit(1);
  }
}

triggerDeploy();
