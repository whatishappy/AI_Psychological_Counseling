"use strict";
// 模拟数据库模型定义文件
// 由于原始项目中没有提供模型定义，这里创建一个简单的模拟实现
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
// 初始化 Sequelize 实例（使用内存数据库用于演示）
exports.sequelize = new sequelize_1.Sequelize('sqlite::memory:', { logging: false });
// 定义 User 模型
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: exports.sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
});
// 初始化数据库
exports.sequelize.sync();
