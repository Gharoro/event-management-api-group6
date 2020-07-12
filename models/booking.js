"use strict";
module.exports = (sequelize, DataTypes) => {
  const booking = sequelize.define(
    "booking", {
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending"
      },
      event_date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      from_time: {
        type: DataTypes.STRING,
        allowNull: false
      },
      to_time: {
        type: DataTypes.STRING,
        allowNull: false
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      additional_info: DataTypes.STRING,
      amount_paid: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.00
      },
      balance: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.00
      },
      centerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      payment_proof: {
        type: DataTypes.STRING,
      },
      referrence: {
        type: DataTypes.STRING,
        allowNull: true
      },
      paid_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      channel: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {}
  );
  booking.associate = function (models) {
    // associations can be defined here
    booking.belongsTo(models.Centers, {
      foreignKey: 'centerId'
    });

    booking.belongsTo(models.customers, {
      foreignKey: 'customerId'
    });
  };
  return booking;
};