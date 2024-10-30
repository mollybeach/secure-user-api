'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if column exists first
    const table = await queryInterface.describeTable('users');
    if (!table.createdAt) {
      await queryInterface.addColumn('users', 'createdAt', {
        type: Sequelize.DATE
      });
    }
    if (!table.updated_at) {
      await queryInterface.addColumn('users', 'updated_at', {
        type: Sequelize.DATE
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'createdAt');
    await queryInterface.removeColumn('users', 'updated_at');
  }
}; 