const bcrypt = require('bcryptjs');
const { User } = require('./src/models/index.js');

async function createTestUser() {
    try {
        // 确保数据库同步
        await User.sequelize.sync();
        
        // 测试用户名和密码
        const username = 'testuser';
        const password = 'testpassword123';
        
        // 检查用户是否已存在
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            console.log(`User ${username} already exists`);
            return;
        }
        
        // 使用bcrypt哈希密码
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 创建新用户
        const newUser = await User.create({ 
            username, 
            password_hash: hashedPassword
        });
        
        console.log(`Created test user:`);
        console.log(`Username: ${newUser.username}`);
        console.log(`User ID: ${newUser.user_id}`);
        console.log(`Password: ${password} (for testing only)`);
        console.log(`Note: The actual stored password is hashed for security`);
    } catch (error) {
        console.error('Error creating test user:', error);
    }
}

createTestUser();