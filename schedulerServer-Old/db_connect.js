const Pool = require("pg").Pool;
const config = require('./config/config');
const pool = new Pool({
    database: config.DATABASE,
    host: config.HOST,
    port: config.PORT,
    user: config.USER,
    password: config.PASSWORD
  });
module.exports = pool;