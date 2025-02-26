const { Sequelize } = require('sequelize');

const isTestEnv = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTestEnv ? process.env.TEST_DB_NAME : process.env.DB_NAME,  // Use test DB when in test mode
  'node_api',
  'password',
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
