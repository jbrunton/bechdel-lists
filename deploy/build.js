const fs   = require('fs');
const argv = require('yargs').argv;
const manifest = require.main.require('./lib/manifest');
const Compose = require.main.require('./lib/compose');

const dryRun = !!argv['dry-run'];

async function build() {
  for (let [envName, envProperties] of Object.entries(manifest.environments)) {
    const buildSha = envProperties.build.sha;
    console.log(`Environment ${envName} should have build SHA ${buildSha}`);

    const deploymentFile = `./deployments/docker-compose.${buildSha}.yml`;
    if (fs.existsSync(deploymentFile)) {
      console.log(`Deployment file exists: ${deploymentFile}`);
    } else {
      console.log(`No deployment file exists at ${deploymentFile}. Starting build.`);

      const compose = new Compose(buildSha);
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
