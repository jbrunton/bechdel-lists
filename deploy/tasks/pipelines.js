const fs = require('fs');
const Mustache = require('mustache');
const manifest = require('../lib/manifest');

const template = fs.readFileSync('./deploy/tasks/pipeline-template.yml', 'utf-8');

for (let [envName, _] of Object.entries(manifest.environments)) {
  console.log('Generating template for ' + envName);
  const workflow = Mustache.render(template, { environment: { name: envName } }, {}, ['<%=', '%>']);
  fs.writeFileSync(`.github/workflows/${envName}.yml`,
    `# IMPORTANT: Generated using deploy:workflows:generate command, do not modify.\n${workflow}`);
}
