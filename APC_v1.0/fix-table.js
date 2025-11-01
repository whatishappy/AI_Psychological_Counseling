const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  
  console.log('Connected to database');
  
  // 修改consultation_sessions表，允许user_id为NULL
  connection.query(
    'ALTER TABLE consultation_sessions MODIFY user_id INT NULL DEFAULT NULL',
    (error, results) => {
      if (error) {
        console.error('Error modifying table:', error);
      } else {
        console.log('Table modified successfully');
      }
      
      connection.end();
    }
  );
});