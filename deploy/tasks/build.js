const fs   = require('fs');
const argv = require('yargs').argv;
require('colors');
const logger = require('../lib/logger');
const manifest = require('../lib/manifest');
const Compose = require('../lib/compose');

if (!argv['build-ids']) {
  console.log('Missing required parameter --build-ids'.red);
  process.exit(64);
}

const dryRun = !!argv['dry-run'];
const skipBuild = !!argv['skip-build'];
const buildIds = argv['build-ids'].toString().split(',');

function indent(message) {
  return '  ' + message.replace(/\n/g, '\n  ');
}

async function build() {
  const completedBuildIds = [];

  for (let buildId of buildIds) {
    console.log(`Starting build for ${buildId}`.bold);
    
    if (completedBuildIds.includes(buildId)) {
      console.log(`  Build ${buildId} already completed, skipping.`);
      continue;
    }

    const compose = new Compose(buildId);
    try {
      await compose.setup();
      if (!skipBuild) {
        await compose.build(logger.dockerLogger);
      } else {
        console.log('--skip-build passed, skipping docker-compose build');
      }
      if (!dryRun) {
        await compose.push(logger.dockerLogger);
      } else {
        console.log('--dry-run passed, skipping docker-compose push');
      }

      const deploymentConfig = await compose.config();
      const deploymentFile = manifest.deploymentFileFor(buildId);

      if (!dryRun) {
        fs.writeFileSync(deploymentFile, deploymentConfig);
        logger.log(`  Generated deployment file ${deploymentFile}:`);
        logger.log(deploymentConfig, { indent: true });
      } else {
        logger.log('--dry-run passed, skipping deployment file creation.');
        logger.log(`Would have created deployment file ${deploymentFile}:`.yellow);
        logger.log(deploymentConfig.yellow);
      }

      await compose.cleanup();
    }
    catch (e) {
      await compose.cleanup();
      console.log(e);
      process.exit(1);
    }

    completedBuildIds.push(buildId);
    console.log(`Completed build for ${buildId}`);
  }
}

build();


// async function build(buildIds) {
//   const completedBuildIds = [];

//   for (let { buildId, envName } of buildIds) {
//     console.log(`Starting build for ${envName.yellow} (${buildId})`.bold);
    
//     if (completedBuildIds.includes(buildId)) {
//       console.log(`  Build ${buildId} already completed, skipping.`);
//       continue;
//     }

//     const deploymentFile = manifest.deploymentFileFor(buildId);

//     const compose = new Compose(buildId);
//     try {
//       await compose.setup();
//       await compose.pull();
//       const missingImages = await compose.checkImages();
//       if (missingImages.length > 0) {
//         console.log('Images missing: ' + JSON.stringify(missingImages));
//         await compose.build();
//         if (!dryRun) {
//           await compose.push();
//         } else {
//           console.log('--dry-run passed, skipping docker-compose push');
//         }
//       } else {
//         console.log('Images exist locally.');
//       }
//       const deploymentConfig = await compose.config();

//       if (!dryRun) {
//         fs.writeFileSync(deploymentFile, deploymentConfig);
//         // TODO: git commit
//         console.log(`Generated deployment file ${deploymentFile}:`);
//         console.log(deploymentConfig);
//       } else {
//         console.log('--dry-run passed, skipping deployment file creation.');
//         console.log(`Would have created deployment file ${deploymentFile}:`);
//         console.log(deploymentConfig);
//       }
//   } catch (e) {
//       console.log('unexpected error');
//       console.log(e);
//     } finally {
//       compose.cleanup();
//     }

//     completedBuildIds.push(buildId);
//   }
// }

// const checkResult = check();
// if (!checkResult.skipBuild) {
//   build(checkResult.buildIds);
// }
