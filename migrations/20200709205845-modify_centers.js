'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Centers',
      'dates_unavailable', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
    );
  },

  down: async (queryInterface, Sequelize) => {

  }
};