const bcrypt = require('bcryptjs');

// 模拟用户数据
const testUser = {
    username: 'testuser',
    password: 'testpassword',
    email: 'test@example.com'
};

async function createTestUser() {
    try {
        // 动态导入模型
        const { sequelize, User } = await import('./src/models/index.js');
        
        // 确保数据库连接
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        // 同步模型
        await sequelize.sync();
        console.log('Models synchronized.');
        
        // 检查用户是否已存在
        const existingUser = await User.findOne({ 
            where: { username: testUser.username } 
        });
        
        if (existingUser) {
            console.log('Test user already exists.');
            console.log('Username:', existingUser.username);
            console.log('User ID:', existingUser.user_id);
            return;
        }
        
        // 创建新用户
        const password_hash = await bcrypt.hash(testUser.password, 10);
        const newUser = await User.create({
            username: testUser.username,
            password_hash,
            email: testUser.email,
            user_type: 'registered'
        });
        
        console.log('Test user created successfully!');
        console.log('Username:', newUser.username);
        console.log('User ID:', newUser.user_id);
        console.log('Email:', newUser.email);
        
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        process.exit(0);
    }
}

createTestUser();