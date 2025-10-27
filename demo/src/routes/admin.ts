import { Router } from 'express';
import { requireAdmin, requireRegistered } from '../middleware/auth';
import { User, UserLoginLog } from '../models/index';

const router = Router();

// For demo, allow registered as admin check to be relaxed later
router.get('/logins', requireRegistered, async (_req, res) => {
    const items = await UserLoginLog.findAll({ order: [['login_time', 'DESC']], limit: 200 });
    res.json(items);
});

router.get('/users', requireRegistered, async (_req, res) => {
    const items = await User.findAll({ attributes: ['user_id', 'username', 'nickname', 'user_type', 'last_login', 'created_at'] });
    res.json(items);
});

export default router;




