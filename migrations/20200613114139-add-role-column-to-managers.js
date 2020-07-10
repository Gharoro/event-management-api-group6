module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Managers',
      'role', {
        type: Sequelize.STRING,
        defaultValue: 'admin',
      },
    );
  },

  down: (queryInterface, Sequelize) => {},
};