#!/usr/bin/env node

const sywac = require('sywac');

if (!process.env.CI) {
  console.log("This script is intended to be run on a CI environment. Set CI=1 to override.");
  process.exit(1);
}

sywac.command('remote <subcommand> [args]', {
  desc: 'Work with remotes via subcommand',
  ignore: ['<subcommand>', '[args]'],
  setup: sywac => {
    sywac
      .command('add <name> <url>', {
        desc: 'Add a new remote',
        paramsDesc: ['The name of the remote', 'The url of the remote'],
        run: (argv, context) => {
          if (remoteExists(argv.name)) {
            return context.cliMessage(`Remote ${argv.name} already exists`)
          }
          console.log(`adding remote ${argv.name} with url ${argv.url}`)
        }
      })
      .command('prune [name=origin]', {
        desc: 'Remove stale remote tracking branches',
        paramsDesc: 'Optionally specify the remote to prune',
        run: argv => console.log(`pruning ${argv.name}`)
      })
  }
})

sywac.showHelpByDefault();

async function main() {
  const argv = await sywac.parseAndExit()
  console.log(JSON.stringify(argv, null, 2))
}

main();
