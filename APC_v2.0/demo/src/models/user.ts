import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '.'; // 从当前目录的index.ts导入sequelize实例
import { UserAttributes } from '../types/index'; // 明确指定从types目录的index.ts文件导入

export class User extends Model<UserAttributes> implements UserAttributes {
  public user_id!: number;
  public username!: string;
  public password_hash!: string;
  public email?: string;
  public user_type!: 'registered' | 'admin';
  public last_login?: Date;
  public nickname?: string;
  public gender?: 'male' | 'female' | 'other';
  public birth_date?: string;
  // 添加协议同意字段
  public agreed_to_terms?: boolean;

  // 时间戳
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    // 移除unique属性，避免重复创建索引
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
    // 移除unique属性，避免重复创建索引
  },
  user_type: {
    type: DataTypes.ENUM('registered', 'admin'),
    defaultValue: 'registered',
    allowNull: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  // 添加协议同意字段的数据库定义
  agreed_to_terms: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true // 启用时间戳
});