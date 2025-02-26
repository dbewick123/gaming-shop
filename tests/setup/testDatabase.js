const sequelize = require('../../src/config/database');

// Get the schema from the active Sequelize instance
const SCHEMA = sequelize.options.schema;

const resetDatabase = async () => {
  await sequelize.query(`
    DO $$ DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = '${SCHEMA}') LOOP
            EXECUTE 'TRUNCATE TABLE ${SCHEMA}.' || r.tablename || ' RESTART IDENTITY CASCADE';
        END LOOP;
    END $$;
  `);
};

module.exports = { resetDatabase };

