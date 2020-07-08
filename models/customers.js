'use strict';
module.exports = (sequelize, DataTypes) => {
  const customers = sequelize.define('customers', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    role: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {});
  customers.associate = function (models) {
    // associations can be defined here
    customers.hasMany(models.booking, {
      foreignKey: 'id'
    });
  };
  return customers;
};