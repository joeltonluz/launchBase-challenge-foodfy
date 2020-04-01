const { Pool } = require('pg');

module.exports = new Pool ({
  user: 'postgres',
  password: 'masterkey',
  host: 'localhost',
  port: '5432',
  database: 'foodfy'
});