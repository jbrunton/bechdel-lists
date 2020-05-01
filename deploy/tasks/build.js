const fs   = require('fs');
const argv = require('yargs').argv;
const manifest = require('../lib/manifest');
const Compose = require('../lib/compose');

const dryRun = !!argv['dry-run'];

async function build() {
  for (let [envName, envProperties] of Object.entries(manifest.environments)) {
    console.log(`Checking environment ${envName} for deployment file.`);
    const deploymentFile = envProperties.deploymentFile;
    if (fs.existsSync(deploymentFile)) {
      console.log(`Deployment file exists: ${deploymentFile}`);
    } else {
      console.log(`No deployment file exists at ${deploymentFile}. Starting build.`);

      const compose = new Compose(envProperties.buildId);
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
    }
  }
}

build();
