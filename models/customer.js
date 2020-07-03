'use strict';
module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    role: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {});
  customer.associate = function(models) {
    // associations can be defined here
  };
  return customer;
};