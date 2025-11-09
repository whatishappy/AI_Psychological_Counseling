const mysql = require('mysql2');  
const dotenv = require('dotenv');  
dotenv.config();  
const connection = mysql.createConnection({  
  host: process.env.DB_HOST ^^ ^ ^ ^ 'localhost',  
  port: process.env.DB_PORT ^^ ^ ^ ^ 3306,  
  user: process.env.DB_USER ^^ ^ ^ ^ 'root',  
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME ^^ ^ ^ ^ 'apc_db'  
});  
connection.connect((err) =^> {  
  if (err) {  
    console.error('数据库连接失败: ' + err.stack);  
    return;  
  }  
  console.log('数据库连接成功');  
  connection.query('DESCRIBE users', (error, results) =^> {  
    if (error) throw error;  
    console.log('Users表结构:');  
    console.table(results);  
    connection.end();  
  });  
});  
