/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Center = sequelize.define('Centers', {
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dates_unavailable: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    facilities: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {});
  Center.associate = function (models) {
    // associations can be defined here
    Center.belongsTo(models.Manager, {
      foreignKey: 'manager_id'
    });
  };
  return Center;
};