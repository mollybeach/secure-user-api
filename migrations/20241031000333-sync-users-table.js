'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, ensure the table is in the correct state
    await queryInterface.dropTable('users');
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Then insert your data
    return queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: "johndoe",
        email: "johndoe@example.com",
        password: "hashedpassword1",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        username: "janedoe",
        email: "janedoe@example.com",
        password: "hashedpassword2",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        username: "alice",
        email: "alice@example.com",
        password: "hashedpassword3",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
}; 