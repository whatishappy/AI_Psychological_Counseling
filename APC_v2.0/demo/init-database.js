#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 自动创建数据库、用户并授予权限
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

// 从环境变量获取数据库配置
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || 'apc_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD || ''; // 可选的root密码

console.log('数据库初始化脚本启动...');
console.log('配置信息:');
console.log('- 主机:', DB_HOST);
console.log('- 端口:', DB_PORT);
console.log('- 数据库名:', DB_NAME);
console.log('- 用户名:', DB_USER);
console.log('- 密码: [HIDDEN]');

async function initDatabase() {
  let connection;
  
  try {
    console.log('\n1. 连接到MySQL服务器...');
    
    // 首先尝试使用配置的用户连接
    try {
      connection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD
      });
      console.log('✓ 使用配置用户连接成功');
    } catch (userError) {
      console.log('✗ 使用配置用户连接失败，尝试使用root用户...');
      console.log('Root密码:', DB_ROOT_PASSWORD ? '[PROVIDED]' : '[NOT PROVIDED]');
      
      // 如果配置用户连接失败，尝试使用root用户
      try {
        connection = await mysql.createConnection({
          host: DB_HOST,
          port: DB_PORT,
          user: 'root',
          password: DB_ROOT_PASSWORD
        });
        console.log('✓ 使用root用户连接成功');
      } catch (rootError) {
        console.error('✗ 无法连接到MySQL服务器，请检查MySQL服务是否运行以及凭证是否正确');
        console.error('错误详情:', rootError.message);
        console.log('\n请检查以下事项:');
        console.log('1. MySQL服务是否正在运行');
        console.log('2. 提供的用户名和密码是否正确');
        console.log('3. 用户是否具有连接权限');
        process.exit(1);
      }
    }

    // 创建数据库
    console.log('\n2. 创建数据库...');
    try {
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
      console.log('✓ 数据库创建成功或已存在');
    } catch (error) {
      console.error('✗ 创建数据库失败:', error.message);
      throw error;
    }

    // 创建用户并授予权限
    console.log('\n3. 创建用户并授予权限...');
    try {
      // 对于MySQL 8.0+，使用新的权限语法
      // 修复SQL语法错误，不能对CREATE USER语句使用参数化查询
      await connection.execute(`CREATE USER IF NOT EXISTS '${DB_USER}'@'${DB_HOST}' IDENTIFIED BY '${DB_PASSWORD}'`);
      await connection.execute(`CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}'`);
      console.log('✓ 用户创建成功或已存在');
      
      // 授予权限
      await connection.execute(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'${DB_HOST}'`);
      await connection.execute(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%'`);
      await connection.execute('FLUSH PRIVILEGES');
      console.log('✓ 权限授予成功');
    } catch (error) {
      // 如果权限不足，提供友好的错误信息
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('✗ 权限不足，无法创建用户或授予权限');
        console.log('请确保使用的用户具有以下权限:');
        console.log('- CREATE USER 权限');
        console.log('- GRANT 权限');
        console.log('- 对目标数据库的管理权限');
      } else {
        console.error('✗ 创建用户或授予权限失败:', error.message);
      }
      throw error;
    }

    // 测试连接
    console.log('\n4. 测试数据库连接...');
    try {
      const testConnection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
      });
      
      await testConnection.execute('SELECT 1+1 as result');
      await testConnection.end();
      console.log('✓ 数据库连接测试成功');
    } catch (error) {
      console.error('✗ 数据库连接测试失败:', error.message);
      throw error;
    }

    console.log('\n🎉 数据库初始化完成！');
    console.log('\n请确保你的 .env 文件包含以下配置:');
    console.log(`
# 数据库配置
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
`);
    
    // 如果没有.env文件，创建一个示例
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      const envContent = `# 数据库配置
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# JWT密钥 (请替换为更强的密钥)
JWT_SECRET=7ZxQ#9kP2!rT5wG8mB3vF6jH1nD4sK7pA0lC2dE5gR8tY1uI3oP6zX9cV2bN5mK8pQ1sT4wG7jZ3
`;
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ 已创建 .env 文件，请根据需要修改其中的配置');
    }
    
  } catch (error) {
    console.error('\n❌ 数据库初始化过程中发生错误:');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 检查是否安装了必要的依赖
try {
  require('mysql2/promise');
  require('dotenv');
} catch (error) {
  console.error('缺少必要的依赖，请先运行: npm install');
  process.exit(1);
}

// 执行初始化
initDatabase();