const yaml = require('js-yaml');
const fs   = require('fs');
const util = require('util');
console.log("Running build...");

//const exec = util.promisify(require('child_process').exec);

const argv = require('yargs').argv;

const Compose = require('./compose');

// function exec(cmd, opts) {
//   const exec = require('child_process').exec;
//   return new Promise((resolve, reject) => {
//     exec(cmd, opts, (error, stdout, stderr) => {
//       if (error) {
//         reject({ error: error });
//       }
//       if (stderr) {
//         reject({ stderr: stderr });
//       }
//       resolve(stdout);
//     });
//   });
// }

async function build() {
  const dryRun = !!argv['dry-run'];
  const manifest = yaml.safeLoad(fs.readFileSync('./manifest.yml', 'utf8'));

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
