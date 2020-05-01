const fs   = require('fs');
const manifest = require('../lib/manifest');
require('colors');

function check() {
  const buildIds = [];

  console.log('Checking for existing deployment files:'.bold)
  
  for (let [envName, envProperties] of Object.entries(manifest.environments)) {
    const deploymentFile = envProperties.deploymentFile;
    const buildId = envProperties.buildId;
    const envDescription = `${envName.yellow} (${buildId})`
    if (fs.existsSync(deploymentFile)) {
      console.log(`  Environment ${envDescription} - ${' OK'.green}`);
    } else {
      console.log(`  Environment ${envDescription} - ${'missing'.yellow}`);
      buildIds.push({ buildId, envName });
    }
  }

  if (buildIds.length == 0) {
    console.log('Deployment files found for all environments, no build required.\n');
    return {
      skipBuild: true
    }
  } else {
    console.log(`Missing deployment files for builds ${buildIds.join(', ')}.\n`);
    return {
      skipBuild: false,
      buildIds: buildIds
    }
  }
}

module.exports = check;
