const manifest = require('../lib/manifest');

module.exports = {
  aliases: ['generate <subcommand> [args]'],
  ignore: ['<subcommand>', '[args]'],
  setup: sywac => {
    sywac
      .command('deployment-matrix', {
        desc: 'Generate a deployment jobs matrix for any deployment jobs required',
        run: async (argv, context) => {
          const tasks = [];

          const buildExists = !!manifest.currentBuild;
          const buildVersion = manifest.version;
          if (!buildExists) {
            console.log(`Build required for version ${buildVersion}.`);
            tasks.push({ task: 'build', version: buildVersion });
          } else {
            console.log(`Found build for version ${buildVersion}: ${JSON.stringify(manifest.currentBuild)}`);
          }

          const deploymentMatrix = {
            include: tasks
            // include: [
            //   { task: 'build', version: '0.12.0' },
            //   { task: 'deploy', environment: 'production', version: '0.11.1' },
            // ]
          };
          console.log(`::set-output name=deploymentMatrix::${JSON.stringify(deploymentMatrix)}}"`);
        }
      })
      .command('build-payload <version>', {
        desc: 'Generate a deployment payload to create a build for <version>',
        run: (argv, context) => {
          const payload = {
            ref: process.env.GITHUB_REF || 'master',
            environment: `build ${argv.version}`,
            task: 'build',
            description: 'Trigger build',
            payload: {
              buildVersion: argv.version
            },
            auto_merge: false,
            required_contexts: []
          };
          console.log(`::set-output name=payload::${JSON.stringify(payload)}`);
        }
      })
      .command('deploy-payload <version> <environment>', {
        desc: 'Generate a deployment payload to deploy <version> to <environment>',
        run: (argv, context) => {
          const payload = {
            ref: process.env.GITHUB_REF || 'master',
            environment: argv.environment,
            task: 'deploy',
            description: 'Trigger deployment',
            payload: {
              buildVersion: argv.version
            },
            auto_merge: false,
            required_contexts: []
          };
          console.log(`::set-output name=payload::${JSON.stringify(payload)}`);
        }
      });
  }
};
