'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      account.belongsTo(models.bank, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        foreignKey: {
          name: 'bank_id',
          type: DataTypes.UUID
        }
      });
      account.belongsTo(models.user, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        foreignKey: {
          name: 'user_id',
          type: DataTypes.UUID
        }
      });
      account.hasMany(models.transaction, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        foreignKey: {
          name: 'account_id',
          type: DataTypes.UUID
        }
      });
      account.hasMany(models.transaction, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        foreignKey: {
          name: 'to_account_id',
          type: DataTypes.UUID
        }
      });
    }
  }
  account.init({
    accountNumber: DataTypes.INTEGER,
    balance: DataTypes.DECIMAL,
    createdBy: DataTypes.UUID,
    updatedBy: DataTypes.UUID,
    deletedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'account',
    underscored: true,
    paranoid: true
  });
  return account;
};