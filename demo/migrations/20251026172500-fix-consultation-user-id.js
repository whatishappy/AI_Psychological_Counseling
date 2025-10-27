'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
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

  async down (queryInterface, Sequelize) {
    // 回滚操作，恢复user_id为NOT NULL
    await queryInterface.changeColumn('consultation_sessions', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};