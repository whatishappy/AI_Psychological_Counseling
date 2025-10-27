import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import { User, UserLoginLog } from '../models/index';
import { signToken } from '../middleware/auth';

const router = Router();

router.post(
    '/register',
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        const { username, password, email, phone, nickname } = req.body;
        const existing = await User.findOne({ where: { username } });
        if (existing) return res.status(409).json({ error: 'Username exists' });
        const password_hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password_hash, email, phone, nickname, user_type: 'registered' });
        const token = signToken({ userId: user.getDataValue('user_id'), userType: 'registered' });
        await UserLoginLog.create({ user_id: user.getDataValue('user_id'), login_type: 'registered', user_agent: req.headers['user-agent'] || '' });
        res.json({ token, user: { user_id: user.getDataValue('user_id'), username, nickname: user.getDataValue('nickname') } });
    }
);

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.getDataValue('password_hash'));
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ userId: user.getDataValue('user_id'), userType: 'registered' });
    await user.update({ last_login: new Date() });
    await UserLoginLog.create({ user_id: user.getDataValue('user_id'), login_type: 'registered', user_agent: req.headers['user-agent'] || '' });
    res.json({ token });
});

router.post('/guest', async (req, res) => {
    // anonymous session for quick consultation; no user row required
    const token = signToken({ userId: null, userType: 'guest' }, '1d');
    await UserLoginLog.create({ user_id: null, login_type: 'guest', user_agent: req.headers['user-agent'] || '' });
    res.json({ token });
});

export default router;


