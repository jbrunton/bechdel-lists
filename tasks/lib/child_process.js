const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;

const defaultLogger = {
  log(data) {
    console.log(data);
  }
};

module.exports = {
  async exec(cmd, options) {
    console.log('Running ' + cmd);
    return await exec(cmd, options);
  },

  spawn(command, options, logger = defaultLogger) {
    return new Promise((resolve, reject) => {
      console.log('Running ' + command);
      const proc = spawn(command, Object.assign({ shell: true}, options));
      proc.stdout.on('data', function (data) {
        logger.log(data.toString());
      });
      proc.stderr.on('data', function (data) {
        logger.log(data.toString());
      });
      proc.on("error", function (error) {
          reject(new Error(command + " encountered error " + error.message));
      });
      proc.on("exit", function(code) {
          if (code !== 0) {
              reject(new Error(command + " exited with code " + code));
          } else {
              resolve();
          }
      });
    });
  }
};
