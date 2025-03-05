require("dotenv").config();
const request = require('supertest');
const app = require('../api');
const sequelize = require("../src/config/database");
const { resetDatabase } = require('../tests/setup/testDatabase');


//Check DB is set to test, error if not
beforeAll(async () => {
  if (
    process.env.NODE_ENV !== "test" &&
    sequelize.getDatabaseName !== process.env.TEST_DB_NAME
  ) {
    throw new Error(
      "Jest tests must be run with NODE_ENV=test to prevent accidental data loss."
    );
  }
});

// Clear database before each test
beforeEach(async () => {
  await resetDatabase(expect.getState().currentTestName); 
});

