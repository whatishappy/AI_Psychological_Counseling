import { Sequelize, DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 数据库配置
const dbName = process.env.DB_NAME || 'apc_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306; // 设置默认端口为3306

console.log('数据库配置信息:', { 
  dbName, 
  dbUser, 
  dbHost, 
  dbPort,
  dbPassword: dbPassword ? '[HIDDEN]' : '[EMPTY]'
}); // 添加调试信息

// 初始化 Sequelize 实例（使用MySQL数据库）
export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: console.log, // 启用SQL日志以便调试
  dialectOptions: {
    multipleStatements: true
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  }
});

// 导入 User 模型
export * from './user';

// 导出一个初始化函数，在应用启动时调用
export const initDatabase = async () => {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 同步所有模型
    await sequelize.sync({ alter: true });
    console.log('数据库表结构同步完成');
  } catch (error) {
    console.error('数据库连接或同步失败:', error);
    throw error;
  }
};