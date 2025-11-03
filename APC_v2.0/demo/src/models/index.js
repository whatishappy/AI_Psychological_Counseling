// 数据库模型定义文件

const { Sequelize, DataTypes, Model } = require('sequelize');

// 初始化 Sequelize 实例，使用 SQLite 内存数据库
const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
  storage: ':memory:'
});

// 定义 User 模型
class User extends Model {}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false
});

// 初始化数据库
sequelize.sync();

module.exports = {
  sequelize,
  User
};