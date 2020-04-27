const models = require.main.require('./models');

module.exports = function(prototype) {
  return function(req, res, next) {
    if (prototype == models.List) {
      if (req.user) {
        if (req.list.userId == req.user.Id) {
          return next();
        }
      }
      res.send(401);
    } else {
      throw Error("Unexpected prototype: " + prototype.name);
    }
  };
};
