'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('reservations', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('reservations', 'name');
  }
};
