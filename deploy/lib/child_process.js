const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  async exec(cmd, options) {
    console.log('running ' + cmd);
    return await exec(cmd, options);
  }
};
