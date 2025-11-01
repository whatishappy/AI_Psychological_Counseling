import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize } from '../src/db/sequelize';
import { Admin } from '../src/models/index';

async function main() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const role = (process.env.ADMIN_ROLE as 'super_admin' | 'content_admin' | 'user_admin') || 'super_admin';

    await sequelize.authenticate();

    const exist = await Admin.findOne({ where: { username } });
    if (exist) {
        console.log(`[seed] Admin already exists: ${username}`);
        process.exit(0);
    }

    const password_hash = await bcrypt.hash(password, 10);
    const created = await Admin.create({ username, email, password_hash, role, is_active: true });
    console.log(`[seed] Admin created -> id=${created.getDataValue('admin_id')} username=${username} role=${role}`);
    process.exit(0);
}

main().catch((err) => {
    console.error('[seed] Failed to create admin:', err);
    process.exit(1);
});


