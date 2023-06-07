'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      account_id: {
        allowNull: false,
        references: {
          model: {
            tableName: 'accounts',
          },
          key: 'id'
        },
        type: Sequelize.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      to_account_id: {
        allowNull: true,
        references: {
          model: {
            tableName: 'accounts',
          },
          key: 'id'
        },
        type: Sequelize.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      closing_balance: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('transactions');
  }
};