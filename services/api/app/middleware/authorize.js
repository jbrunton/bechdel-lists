const authorization = require.main.require('./app/usecases/authorization');

module.exports = function(prototype) {
  return function(req, res, next) {
    if (authorization.isOwner(prototype, req)) {
      return next();
    } else {
      return res.send(401);
    }
  };
};
