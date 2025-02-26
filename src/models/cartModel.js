const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,  // One cart per user
  },
}, {
  tableName: 'cart',
  schema: sequelize.options.schema,
  timestamps: false,
});

Cart.associate = (models) => {
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'items' });
  };

module.exports = Cart;
