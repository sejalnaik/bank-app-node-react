'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bank.hasMany(models.account, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        foreignKey: {
          name: 'bank_id',
          type: DataTypes.UUID
        }
      });
    }
  }
  bank.init({
    name: DataTypes.STRING,
    abbrevieation: DataTypes.STRING,
    createdBy: DataTypes.UUID,
    updatedBy: DataTypes.UUID,
    deletedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'bank',
    underscored: true,
    paranoid: true
  });
  return bank;
};