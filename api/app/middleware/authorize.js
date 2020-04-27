const models = require.main.require('./models');

module.exports = function(prototype) {
  return async function(req, res, next) {
    if (prototype == models.List) {
      if (req.userId) {
        if (req.list.userId == req.userId) {
          return next();
        }
      }
      res.send(401);
    } else {
      throw Error("Unexpected prototype: " + prototype.name);
    }
  };
};
