'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});

  User.findOrCreateByEmail = async function(email, name) {
    const [user, created] = await User.findOrCreate({
      where: { email: email }
    });
    if (created) {
      user.logEvent('Created new user', user);
    } else {
      user.logEvent('Found existing user', user);
    }
    if (!!name) {
      user.name = name;
      await user.save();
    }
    return user;
  };

  User.prototype.getExcludingPII = function() {
    const { name, email, ...excludingPII } = this.get();
    return excludingPII;
  }

  User.prototype.logEvent = function logEvent(message) {
    const userAsString = JSON.stringify(this.getExcludingPII());
    console.log(`${message}: ${userAsString}`);
  }

  User.associate = function(models) {
    User.hasMany(models.List);
  };

  return User;
};