const fs = require('fs');
const yaml = require('js-yaml');

const manifest = yaml.safeLoad(fs.readFileSync('./manifest.yml', 'utf8'));

module.exports = manifest;
