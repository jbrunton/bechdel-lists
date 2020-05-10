const manifests = require('../lib/manifests');

module.exports = {
  flags: 'generate <subcommand> [args]',
  ignore: ['<subcommand>', '[args]'],
  setup: sywac => {
    sywac
      .command('deployment-matrix', {
        desc: 'Generate a deployment jobs matrix for any deployment jobs required',
        run: async (argv, context) => {
          const tasks = [];          
          const manifest = await manifests.local.getManifest();
          console.log(JSON.stringify(manifest));
          const currentBuild = await manifests.local.getCurrentBuild();
          const buildExists = !!currentBuild;
          const buildVersion = manifest.version;
          if (!buildExists) {
            console.log(`Build required for version ${buildVersion}.`);
            tasks.push({ task: 'build' });
          } else {
            console.log(`Found build for version ${buildVersion}: ${JSON.stringify(currentBuild)}`);
          }

          for (let [envName, envManifest] of Object.entries(manifest.environments)) {
            const latestDeployment = await manifests.local.getLatestDeployment(envName);
            const latestVersion = latestDeployment ? latestDeployment.version : null;

            console.log(`envName: ${envName}, manifest: ${JSON.stringify(envManifest)}`);
            console.log(`Manifest version for ${envName} is ${envManifest.version}, latest deployed version is ${latestVersion}`);
            if (envManifest.version != latestVersion) {
              console.log('Deployed version out of date, deployment required.');
              tasks.push({ task: 'deploy', environment: envName });
            } else {
              console.log('Versions match, skipping deployment');
            }
          }

          const deploymentMatrix = {
            include: tasks
          };
          if (tasks.length > 0) {
            console.log('::set-output name=deploymentsRequired::1');
            console.log(`::set-output name=deploymentMatrix::${JSON.stringify(deploymentMatrix)}}`);
          } else {
            console.log('::set-output name=deploymentsRequired::0');
          }
        }
      })
      .command('deployment-info <environment>', {
        desc: 'Generate deployment info for the given environment',
        run: async (argv, context) => {
          const manifest = await manifests.local.getManifest();
          const envName = argv.environment;
          const envManifest = manifest.environments[envName];
          const build = manifests.local.findBuild(envManifest.version);
          const buildFile = manifests.buildFilePath(build.id);
          console.log(`::set-output name=host::${envManifest.host}`);
          console.log(`::set-output name=buildFile::${buildFile}`);
        }
      })
  }
};
