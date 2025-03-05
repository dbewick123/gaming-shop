const sequelize = require('../../src/config/database');

const resetDatabase = async (test) => {
  console.log(`Running test: ${test}`);
  try {
    await sequelize.query(
      'TRUNCATE TABLE users, products, product_reviews, orders, cart_items, cart, order_items RESTART IDENTITY CASCADE;',
      { raw: true }
    );
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};


module.exports = { resetDatabase };

