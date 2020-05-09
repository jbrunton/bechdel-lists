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
          const manifest = manifests.local.getManifest();
          console.log(JSON.stringify(manifest));
          const buildExists = !!manifests.local.getCurrentBuild();
          const buildVersion = manifest.version;
          if (!buildExists) {
            console.log(`Build required for version ${buildVersion}.`);
            tasks.push({ task: 'build' });
          } else {
            console.log(`Found build for version ${buildVersion}: ${JSON.stringify(manifest.currentBuild)}`);
          }

          for (let [envName, envManifest] of Object.entries(manifest.environments)) {
            const deployments = new Deployments(envName);
            const latestDeployment = deployments.getLatest();
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
        run: (argv, context) => {
          const manifest = manifests.local.getManifest();
          const envName = argv.environment;
          const envManifest = manifest.environments[envName];
          const build = manifests.local.findBuild(envManifest.version);
          const buildFile = manifests.buildFilePath(build.id);
          console.log(`::set-output name=host::${envManifest.host}`);
          console.log(`::set-output name=buildFile::${buildFile}`);
        }
      })
      .command('build-payload', {
        desc: 'Generate a deployment payload to create a build',
        run: (argv, context) => {
          const payload = {
            ref: process.env.GITHUB_REF || 'master',
            environment: 'build',
            task: 'build',
            description: 'Trigger build',
            auto_merge: false,
            required_contexts: []
          };
          console.log(`::set-output name=payload::${JSON.stringify(payload)}`);
        }
      })
      .command('deploy-payload <environment>', {
        desc: 'Generate a deployment payload to deploy to <environment>',
        run: (argv, context) => {
          const payload = {
            ref: process.env.GITHUB_REF || 'master',
            environment: argv.environment,
            task: 'deploy',
            description: 'Trigger deployment',
            auto_merge: false,
            required_contexts: []
          };
          console.log(`::set-output name=payload::${JSON.stringify(payload)}`);
        }
      });
  }
};
