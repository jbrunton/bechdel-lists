const { exec } = require('../lib/child_process');
const manifests = require('../lib/manifests');

module.exports = {
  flags: 'deploy <version> <environment>',
  desc: 'Deploy build <version> to <environment>',
  params: [
    { type: 'version', strict: true },
    { type: 'environment', strict: true }
  ],
  run: async (argv, context) => {
    const dryRun = argv['dry-run'];

    const manifest = await manifests.remote.getManifest();
    const currentVersion = manifest.environments[argv.environment].version;
    const nextVersion = argv.version;
    console.log(`currentVersion: ${currentVersion}, nextVersion: ${nextVersion}`);

    const payload = {
      ref: 'master',
      environment: 'update_manifest',
      task: 'update_manifest',
      description: 'New version',
      auto_merge: false,
      payload: { version: nextVersion, environment: argv.environment },
      required_contexts:[]
    };

    const command = `echo '${JSON.stringify(payload)}' | hub api "repos/jbrunton/bechdel-demo/deployments" --input -`;
    if (!dryRun) {
      await exec(command, process.env);
    } else {
      console.log('--dry-run passed, skipping deployment. Would have run:');
      console.log(command);
    }
  }
};
