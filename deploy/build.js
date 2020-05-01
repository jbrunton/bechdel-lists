const yaml = require('js-yaml');
const fs   = require('fs');
const util = require('util');
console.log("Running build...");

//const exec = util.promisify(require('child_process').exec);

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
        } else {
          console.log('Images exist locally.');
        }
        // const result = await compose.config();
        // if (result.stdout) {
        //   console.log('stdout');
        //   const deploymentConfig = result.stdout;
        //   console.log('config: ' + deploymentConfig);
        //   fs.writeFileSync(deploymentFile, deploymentConfig);
        //   console.log(`Generated deployment file ${deploymentFile}:`);
        //   console.log(deploymentConfig);
        // } else {
        //   console.log('stderr');
        //   console.log(result.stderr);
        // }
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
