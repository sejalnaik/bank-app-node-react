'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      account.belongsTo(models.account, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        foreignKey: {
          name: 'account_id',
          type: DataTypes.UUID
        }
      });
      account.belongsTo(models.account, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        foreignKey: {
          name: 'to_account_id',
          type: DataTypes.UUID
        }
      })
    }
  }
  transaction.init({
    type: DataTypes.STRING,
    closingBalance: DataTypes.DECIMAL,
    amount: DataTypes.DECIMAL,
    createdBy: DataTypes.UUID,
    updatedBy: DataTypes.UUID,
    deletedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'transaction',
    underscored: true,
    paranoid: true
  });
  return transaction;
};