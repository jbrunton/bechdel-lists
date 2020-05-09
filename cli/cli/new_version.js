const semver = require('semver');

const manifests = require('../lib/manifests');
const { exec } = require('../lib/child_process');

module.exports = {
  flags: 'new-version [version]',
  run: async (argv, context) => {
    const dryRun = argv['dry-run'];
    const manifest = await manifests.remote.getManifest();
    const currentVersion = manifest.version;
    const nextVersion = argv.version ? argv.version : semver.inc(currentVersion, releaseType(argv));
    console.log(`currentVersion: ${currentVersion}, nextVersion: ${nextVersion}`);

    const payload = {
      ref: 'master',
      environment: 'update_manifest',
      task: 'update_manifest',
      description: 'New version',
      auto_merge: false,
      payload: { version: nextVersion },
      required_contexts:[]
    };

    const command = `echo '${JSON.stringify(payload)}' | hub api "repos/jbrunton/bechdel-demo/deployments" --input -`;
    if (!dryRun) {
      await exec(command, process.env);
    } else {
      console.log('--dry-run passed, skipping deployment. Would have run:');
      console.log(command);
    }
  },
  setup: sywac => {
    sywac 
      .boolean('--major')
      .boolean('--minor')
      .boolean('--patch')
  }
};

function releaseType(argv) {
  if (argv.major) {
    return 'major';
  }
  if (argv.minor) {
    return 'minor';
  };
  if (argv.patch) {
    return 'patch';
  }

  throw new Error("Version or --major, --minor, -patch required.");
}