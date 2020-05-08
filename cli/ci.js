#!/usr/bin/env node

const sywac = require('sywac');
const { exec } = require('./lib/child_process');

if (!process.env.CI) {
  console.log("This script is intended to be run on a CI environment. Set CI=1 to override.");
  process.exit(1);
}

sywac.command('generate <subcommand> [args]', {
  ignore: ['<subcommand>', '[args]'],
  setup: sywac => {
    sywac
      .command('deployment-matrix', {
        desc: 'Generate a deployment jobs matrix for any deployment jobs required',
        run: async (argv, context) => {
          const deploymentMatrix = {
            include: [
              { task: 'build', version: '0.12.0' },
              { task: 'deploy', environment: 'production', version: '0.11.1' },
            ]
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
});

sywac.boolean('--dry-run', {
  desc: "Avoid committing, saving or pushing any changes. Potential changes will be logged to the console instead."
});

sywac.showHelpByDefault();

async function main() {
  await sywac.parseAndExit();
}

main();
