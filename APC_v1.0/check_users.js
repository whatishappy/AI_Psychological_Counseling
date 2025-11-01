const { sequelize, User } = require('./src/models');

async function checkUsers() {
    try {
        // 先同步数据库确保表结构正确
        await sequelize.sync();
        
        const users = await User.findAll();
        console.log('Users in database:');
        users.forEach(u => {
            console.log(`ID: ${u.user_id}, Username: ${u.username}, Password hash: ${u.password_hash}`);
        });
        
        if (users.length === 0) {
            console.log('No users found in database');
        }
    } catch(e) {
        console.error('Error checking users:', e);
    } finally {
        process.exit(0);
    }
}

checkUsers();