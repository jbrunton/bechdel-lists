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
        await compose.pull();
        const result = await compose.config();
        if (result.stdout) {
          const deploymentFile = result.stdout;
          console.log('config: ' + deploymentFile);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
}

build();
