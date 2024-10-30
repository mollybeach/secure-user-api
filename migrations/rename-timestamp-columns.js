'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('users', 'created_at', 'createdAt');
    await queryInterface.renameColumn('users', 'updated_at', 'updatedAt');
  },

  down: async (queryInterface) => {
    await queryInterface.renameColumn('users', 'createdAt', 'created_at');
    await queryInterface.renameColumn('users', 'updatedAt', 'updated_at');
  }
};
