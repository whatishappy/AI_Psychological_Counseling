'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * 异步函数，用于更新数据库表结构
   * @param {Object} queryInterface - Sequelize的查询接口对象，用于执行数据库操作
   * @param {Object} Sequelize - Sequelize构造函数，包含数据类型定义
   * @returns {Promise<void>} 返回一个Promise，表示异步操作完成
   */
  async up (queryInterface, Sequelize) {
      // 修改consultation_sessions表，允许user_id为NULL
      await queryInterface.changeColumn('consultation_sessions', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    },

  /**
   * 数据库迁移回滚函数
   * 用于将consultation_sessions表的user_id字段恢复为NOT NULL约束
   * 
   * @param {object} queryInterface - Sequelize查询接口对象，用于执行数据库操作
   * @param {object} Sequelize - Sequelize构造函数，提供数据类型和操作符
   * @returns {Promise<void>} 返回一个Promise，表示异步操作完成
   */
  async down (queryInterface, Sequelize) {
      // 回滚操作，恢复user_id为NOT NULL
      await queryInterface.changeColumn('consultation_sessions', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: false
      });
    }
};