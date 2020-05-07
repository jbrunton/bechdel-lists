#!/usr/bin/env node

const sywac = require('sywac');

if (!process.env.CI) {
  console.log("This script is intended to be run on a CI environment. Set CI=1 to override.");
  process.exit(1);
}

sywac.command('check manifest', {
  desc: 'Check for any builds required',
  run: async (argv, context) => {
    const buildMatrix = {
      include: [
        { version: '0.12.0' }
      ]
    }
    const deploymentMatrix = {
      include: [
        { environment: 'production', version: '0.11.1' },
      ]
    };
    console.log(`::set-output name=buildMatrix::${JSON.stringify(buildMatrix)}}"`);
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
            environment: 'build',
            task: 'build',
            description: 'Trigger build',
            payload: {
              buildVersion: argv.version
            }
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
            }
          };
          console.log(`::set-output name=payload::${JSON.stringify(payload)}`);
        }
      });
  }
});

sywac.showHelpByDefault();

async function main() {
  await sywac.parseAndExit();
}

main();
