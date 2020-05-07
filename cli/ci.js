#!/usr/bin/env node

const sywac = require('sywac');
const { exec } = require('./lib/child_process');

if (!process.env.CI) {
  console.log("This script is intended to be run on a CI environment. Set CI=1 to override.");
  process.exit(1);
}

sywac.command('check manifest', {
  desc: 'Check for any builds required',
  run: async (argv, context) => {
    const deploymentMatrix = {
      include: [
        { task: 'build', version: '0.12.0' },
        { task: 'deploy', environment: 'production', version: '0.11.1' },
      ]
    };
    console.log(`::set-output name=deploymentMatrix::${JSON.stringify(deploymentMatrix)}}"`);
  }
});

sywac.command('generate <subcommand> [args]', {
  ignore: ['<subcommand>', '[args]'],
  setup: sywac => {
    sywac
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
});

sywac.command('deploy <payload>', {
  desc: 'Create a Github deployment with the given payload',
  run: async (argv, context) => {
    const command = `echo '${argv.payload}' | hub api "repos/jbrunton/bechdel-demo/deployments" --input -`;
    const dryRun = argv['dry-run'];
    if (!dryRun) {
      try {
        await exec(command, { env: process.env });
      } catch (e) {
        console.log(e);
        process.exit(1);
      }
    } else {
      console.log('--dry-run passed, skipping deploy. Would have run:');
      console.log('  ' + command);
    }
  }
})

sywac.boolean('--dry-run', {
  desc: "Avoid committing, saving or pushing any changes. Potential changes will be logged to the console instead."
});

sywac.showHelpByDefault();

async function main() {
  await sywac.parseAndExit();
}

main();
