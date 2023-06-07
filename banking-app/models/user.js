'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.account, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        foreignKey: {
          name: 'user_id',
          type: DataTypes.UUID
        }
      });
    }
  }
  user.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    totalBalance: DataTypes.DECIMAL,
    isAdmin: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    createdBy: DataTypes.UUID,
    updatedBy: DataTypes.UUID,
    deletedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
    paranoid: true
  });
  return user;
};