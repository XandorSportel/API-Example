// ? ----- [ Packages ] -----
const mysql = require('mysql2/promise');
require('dotenv/config')

async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}