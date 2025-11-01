import { User } from './src/models';

async function checkUsers() {
    try {
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