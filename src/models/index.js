const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Import all models
const Cart = require('./cartModel');
const CartItem = require('./cartItemModel');
const Product = require('./productModel');
const Order = require('./orderModel');
const OrderItem = require('./orderItemModel');
const ProductReview = require('./productReviewModel');
const User = require('./userModel');

// Store models in an object
const models = {
  Cart,
  CartItem,
  Product,
  Order,
  OrderItem,
  ProductReview,
  User
};

// Call associate methods for each model (if they exist)
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export initialized Sequelize instance and all models
module.exports = {
  ...models
};
