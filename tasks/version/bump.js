const axios = require('axios');

const { exec } = require('../lib/child_process');
const args = require('../lib/args');
const logger = require('../lib/logger');

const dryRun = args.boolean('dry-run');

async function triggerBump() {
  const payload = {
    ref: "master",
    environment: "ci-run",
    task: "ci:version:bump",
    description: "Trigger ci:version:bump",
    payload: {
      args: "--patch"
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

triggerBump();
