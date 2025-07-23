// backend/config/db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce_db',
  password: 'Srikrishna@9514', // ✅ your actual password
  port: 5432,
});

module.exports = pool;
