const models = require.main.require('./models');

module.exports = {
  isOwner: isOwner
};

function isOwner(prototype, req) {
  if (prototype == models.List) {
    if (req.user) {
      if (req.list && req.list.UserId == req.user.id) {
        return true;
      }
    }
    return false;
  } else {
    throw Error("Unexpected prototype: " + prototype.name);
  }
}
