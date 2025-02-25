const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'order_items',
  timestamps: false,
});

module.exports = OrderItem;
