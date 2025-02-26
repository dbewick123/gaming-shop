require('dotenv').config();
const sequelize = require('../src/config/database');
const { resetDatabase } = require('./setup/testDatabase');

beforeAll(async () => {
    if (process.env.NODE_ENV !== 'test' && sequelize.getDatabaseName !== process.env.TEST_DB_NAME) {
      throw new Error('Jest tests must be run with NODE_ENV=test to prevent accidental data loss.');
    }
  });

beforeEach(async () => {
  await resetDatabase(); // Clean test database before each test
});

