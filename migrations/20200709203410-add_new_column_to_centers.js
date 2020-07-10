'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Centers',
      'unavailable_dates', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
    );
  },

  down: async (queryInterface, Sequelize) => {

  }
};