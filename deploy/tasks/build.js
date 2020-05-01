const fs   = require('fs');
const argv = require('yargs').argv;
const manifest = require('../lib/manifest');
const Compose = require('../lib/compose');
const check = require('./check');

const dryRun = !!argv['dry-run'];

async function build(buildIds) {
  const completedBuildIds = [];

  for (let { buildId, envName } of buildIds) {
    console.log(`Starting build for ${envName.yellow} (${buildId})`.bold);
    
    if (completedBuildIds.includes(buildId)) {
      console.log(`  Build ${buildId} already completed, skipping.`);
      continue;
    }

    const deploymentFile = manifest.deploymentFileFor(buildId);

    const compose = new Compose(buildId);
    try {
      await compose.setup();
      await compose.pull();
      const missingImages = await compose.checkImages();
      if (missingImages.length > 0) {
        console.log('Images missing: ' + JSON.stringify(missingImages));
        await compose.build();
        if (!dryRun) {
          await compose.push();
        } else {
          console.log('--dryrun passed, skipping docker-compose push');
        }
      } else {
        console.log('Images exist locally.');
      }
      const deploymentConfig = await compose.config();

      if (!dryRun) {
        fs.writeFileSync(deploymentFile, deploymentConfig);
        // TODO: git commit
        console.log(`Generated deployment file ${deploymentFile}:`);
        console.log(deploymentConfig);
      } else {
        console.log('--dryrun passed, skipping deployment file creation.');
        console.log(`Would have created deployment file ${deploymentFile}:`);
        console.log(deploymentConfig);
      }
  } catch (e) {
      console.log('unexpected error');
      console.log(e);
    } finally {
      compose.cleanup();
    }

    completedBuildIds.push(buildId);
  }
}

const checkResult = check();
if (!checkResult.skipBuild) {
  build(checkResult.buildIds);
}
