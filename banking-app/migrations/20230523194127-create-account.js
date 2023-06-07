'use strict';

const { UUID } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      bank_id: {
        allowNull: false,
        references: {
          model: {
            tableName: 'banks',
          },
          key: 'id'
        },
        type: Sequelize.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
        type: Sequelize.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      account_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by: {
        allowNull: false,
        type: Sequelize.UUID
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_by: {
        allowNull: false,
        type: Sequelize.UUID
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deleted_by: {
        allowNull: true,
        type: Sequelize.UUID
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accounts');
  }
};