const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database');
    throw err;
  }
  console.log('Connected to database');
});

module.exports = db;
