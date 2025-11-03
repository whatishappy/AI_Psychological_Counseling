import { sequelize, User } from './src/models/index';

async function checkUsers() {
    try {
        await sequelize.sync();
        const users = await User.findAll();
        console.log('Users in database:');
        users.forEach(u => {
            console.log(`ID: ${u.user_id}, Username: ${u.username}, Password hash: ${u.password_hash}`);
        });
    } catch(e) {
        console.error(e);
    }
}

checkUsers();