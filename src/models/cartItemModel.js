const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'cart_items',
  timestamps: false,
});

CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id' });
    CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
};

module.exports = CartItem;
