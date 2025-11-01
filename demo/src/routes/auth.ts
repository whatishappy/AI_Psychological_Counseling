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
        try {
            const { username, password, email, phone, nickname } = req.body;
            console.log('Registration attempt:', { username, email }); // 添加日志
            
            const existing = await User.findOne({ where: { username } });
            if (existing) {
                console.log('Username already exists:', username); // 添加日志
                return res.status(409).json({ error: 'Username exists' });
            }
            
            // 检查邮箱是否已存在
            if (email) {
                const existingEmail = await User.findOne({ where: { email } });
                if (existingEmail) {
                    console.log('Email already registered:', email); // 添加日志
                    return res.status(409).json({ error: 'Email already registered' });
                }
            }
            
            const password_hash = await bcrypt.hash(password, 10);
            console.log('Creating user with data:', { username, email, phone, nickname }); // 添加日志
            
            const user = await User.create({ username, password_hash, email, phone, nickname, user_type: 'registered' });
            console.log('User created successfully:', user.getDataValue('user_id')); // 添加日志
            
            const token = signToken({ userId: user.getDataValue('user_id'), userType: 'registered' });
            await UserLoginLog.create({ user_id: user.getDataValue('user_id'), login_type: 'registered', user_agent: req.headers['user-agent'] || '' });
            res.json({ token, user: { user_id: user.getDataValue('user_id'), username, nickname: user.getDataValue('nickname') } });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
);

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username }); // 添加日志
        
        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.log('User not found:', username); // 添加日志
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        console.log('User found, checking password...'); // 添加日志
        const ok = await bcrypt.compare(password, user.getDataValue('password_hash'));
        if (!ok) {
            console.log('Invalid password for user:', username); // 添加日志
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        const token = signToken({ userId: user.getDataValue('user_id'), userType: 'registered' });
        await user.update({ last_login: new Date() });
        await UserLoginLog.create({ user_id: user.getDataValue('user_id'), login_type: 'registered', user_agent: req.headers['user-agent'] || '' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

router.post('/guest', async (req, res) => {
    // anonymous session for quick consultation; no user row required
    try {
        const token = signToken({ userId: null, userType: 'guest' }, '1d');
        await UserLoginLog.create({ user_id: null, login_type: 'guest', user_agent: req.headers['user-agent'] || '' });
        res.json({ token });
    } catch (error) {
        console.error('Guest login error:', error);
        res.status(500).json({ error: 'Guest login failed' });
    }
});

export default router;