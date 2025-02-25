const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,  
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,   
    validate: {
      min: 0,         
    },
  },
}, {
  tableName: 'products',  
  timestamps: false,   
});

Product.associate = (models) => {
  Product.hasMany(models.CartItem, { foreignKey: 'product_id' }); 
};

module.exports = Product;
