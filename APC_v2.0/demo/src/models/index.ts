// 模拟数据库模型定义文件
// 由于原始项目中没有提供模型定义，这里创建一个简单的模拟实现

import { Sequelize, DataTypes, Model } from 'sequelize';

// 初始化 Sequelize 实例（使用内存数据库用于演示）
export const sequelize = new Sequelize('sqlite::memory:', { logging: false });

// 定义 User 模型
export class User extends Model {
  public user_id!: number;
  public username!: string;
  public password_hash!: string;
}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
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