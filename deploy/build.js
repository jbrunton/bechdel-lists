const yaml = require('js-yaml');
const fs   = require('fs');

console.log("Running build...");

function exec(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error });
      }
      if (stderr) {
        reject({ stderr: stderr });
      }
      resolve(stdout);
    });
  });
}

async function build() {
  const manifest = yaml.safeLoad(fs.readFileSync('./deployments/manifest.yml', 'utf8'));

  for (let [envName, envProperties] of Object.entries(manifest.environments)) {
    const buildSha = envProperties.build.sha;
    console.log(`Environment ${envName} should have build SHA ${buildSha}`);
  }
}

build();
