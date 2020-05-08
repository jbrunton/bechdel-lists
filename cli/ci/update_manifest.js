const manifest = require('../lib/manifest');

module.exports = {
  flags: 'update-manifest <version> [environment]',
  run: (argv, context) => {
    const envName = argv.environment;
    const nextVersion = argv.version;

    if (envName) {
      const envManifest = manifest.environments[envName];
      const currentVersion = envManifest.version;
      console.log(`Current version of ${envName} is ${currentVersion}, updating to ${nextVersion}`);
    } else {
      const currentVersion = manifest.version;
      console.log(`Current version is ${currentVersion}, updating to ${nextVersion}`);
    }
  }
}
