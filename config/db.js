const { Pool } = require('pg');

const pool = new Pool({
  user: 'mollybeach',
  host: 'localhost',
  database: 'mollybeach',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

module.exports = pool;
