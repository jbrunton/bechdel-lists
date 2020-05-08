const chalk = require('chalk');

const command = s => chalk.green.bold(s);
const arg = s => chalk.yellow.bold(s);

module.exports = {
  group: str => chalk.bold(str),

  usagePrefix: (s) => {
    return chalk.bold(s.slice(0, 6)) + ' ' + command((s.slice(7)))
  },
  usageCommandPlaceholder: s => command(s),
  usagePositionals: s => arg(s),
  usageArgsPlaceholder: s => arg(s),
  usageOptionsPlaceholder: s => arg(s),

  flags: (s, type) => {
    if (type.datatype === 'command') {
      s = s.split(' ')
      return command(s[0]) + (s[1] ? ' ' + arg(s.slice(1).join(' ')) : '')
    }
    return arg(s);
  },

  hints: s => chalk.grey(s)
};
