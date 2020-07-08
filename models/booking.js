"use strict";
module.exports = (sequelize, DataTypes) => {
  const booking = sequelize.define(
    "booking",
    {
      status: { type: DataTypes.STRING, defaultValue: "Pending" },
      event_date: { type: DataTypes.DATE, allowNull: false },
      from: { type: DataTypes.DATE, allowNull: false },
      to: { type: DataTypes.DATE, allowNull: false },
      purpose: { type: DataTypes.STRING, allowNull: false },
      customerId: { type: DataTypes.INTEGER, allowNull: false },
      additional_info: DataTypes.STRING,
      amount_paid: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
      balance: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
      centerId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {}
  );
  booking.associate = function(models) {
    // associations can be defined here
    booking.belongsTo(models.Centers, { foreignKey: 'center_id' });
  };
  return booking;
};
