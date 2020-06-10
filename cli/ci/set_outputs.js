const manifests = require('../lib/manifests');

module.exports = {
  flags: 'set-outputs <subcommand> [args]',
  ignore: ['<subcommand>', '[args]'],
  setup: sywac => {
    sywac
      .command('manifest-checks', {
        desc: 'Generate a deployment jobs matrix for any deployment jobs required',
        run: async (argv, context) => {
          const manifest = await manifests.local.getManifest();

          const currentBuild = await manifests.local.getCurrentBuild();
          const buildExists = !!currentBuild;
          const buildVersion = manifest.version;
          if (!buildExists) {
            console.log(`Build required for version ${buildVersion}.`);
            console.log('::set-output name=buildRequired::1');
          } else {
            console.log(`Found build for version ${buildVersion}: ${JSON.stringify(currentBuild)}`);
            console.log('::set-output name=buildRequired::0');
          }

          const tasks = [];
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
          const build = await manifests.local.findBuild(envManifest.version);
          if (!build) {
            throw new Error(`Unable to find build for version ${envManifest.version}`);
          }
          const buildFile = manifests.buildFilePath(build.id);
          console.log(`::set-output name=host::${envManifest.host}`);
          console.log(`::set-output name=buildVersion::${envManifest.version}`);
          console.log(`::set-output name=buildFile::${buildFile}`);
        }
      })
      .command('deploy-payload <environment>', {
        desc: 'Generate a deployment payload to deploy to <environment>',
          run: (argv, context) => {
          const payload = {
            ref: process.env.GITHUB_REF || 'list-197',
            environment: argv.environment,
            description: 'Trigger deployment',
            auto_merge: false,
            required_contexts: []
          };
          console.log(`::set-output name=payload::${JSON.stringify(payload)}`);
        }
      });
  }
};
