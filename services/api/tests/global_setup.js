const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async function() {
  await exec('npm run db:test:reset', { env: process.env });
};
