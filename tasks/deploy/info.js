const axios = require('axios');
const yaml = require('js-yaml');

async function listEnvironments() {
  const manifestPath = 'https://raw.githubusercontent.com/jbrunton/bechdel-demo/master/manifest.yml';
  const manifestFile = await axios.get(manifestPath);
  const manifest = yaml.safeLoad(manifestFile.data);
  const envInfo = Object.entries(manifest.environments).map(([envName, envInfo]) => {
    return Object.assign({ name: envName }, envInfo);
  });
  console.table(envInfo, ['name', 'version', 'host']);
}

listEnvironments();
