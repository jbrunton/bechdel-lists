'use strict';
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});

  User.prototype.logEvent = function logEvent(message) {
    const { name, email, ...excludingPII } = this.get()
    const userAsString = JSON.stringify(excludingPII);
    console.log(`${message}: ${userAsString}`);
  }  

  User.associate = function(models) {
    User.hasMany(models.List);
  };

  return User;
};