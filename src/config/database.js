const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('game_store_api', 'node_api', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
