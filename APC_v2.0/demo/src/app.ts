/**
 * AI心理咨询服务主应用文件
 * 这是使用TypeScript编写的Express应用入口点
 */

import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { callAIModel, AIModelType } from './aiService';
import { User, sequelize } from './models'; // 导入User模型和sequelize实例

// 创建Express应用实例
const app = express();
// 从环境变量获取端口号，默认为3000
const PORT = process.env.PORT || 3000;

// 中间件配置
// 解析JSON请求体
app.use(express.json());
// 提供静态文件服务，将上级目录作为静态资源根目录
app.use(express.static(path.join(__dirname, '..')));

// JWT配置
interface AuthPayload {
    userId: number | null; // null for guest
    userType: 'guest' | 'registered' | 'admin';
}

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret';

function signToken(payload: AuthPayload, expiresIn: SignOptions['expiresIn'] = '7d' as unknown as SignOptions['expiresIn']) {
    const options: SignOptions = { expiresIn } as SignOptions;
    return jwt.sign(payload as object, JWT_SECRET, options);
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Unauthorized' });
    
    // 正确处理Bearer token
    let token = header;
    if (header.startsWith('Bearer ')) {
        token = header.substring(7); // 移除 'Bearer ' 前缀
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        (req as any).auth = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// 数据库初始化函数
const initializeDatabase = async () => {
  try {
    console.log('开始数据库初始化...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 同步所有模型，但不强制添加索引
    await sequelize.sync({ alter: true });
    console.log('数据库表结构同步完成');
  } catch (error) {
    console.error('数据库连接或同步失败:', error);
    // 如果同步失败，尝试不带alter参数的同步
    try {
      await sequelize.sync();
      console.log('数据库表结构同步完成（使用默认同步）');
    } catch (syncError) {
      console.error('数据库同步也失败了:', syncError);
      throw syncError;
    }
  }
};

// 健康检查端点
// 用于检查服务是否正常运行
app.get('/health', (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    service: 'AI Psychology Platform - Main Application'
  });
});

// API路由
app.use('/api', (req, res, next) => {
  // 记录API请求
  console.log(`API Request: ${req.method} ${req.path}`);
  next();
});

// 认证路由
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, email, nickname, gender, birth_date } = req.body;
        
        // 检查用户名是否已存在
        const existing = await User.findOne({ where: { username } });
        if (existing) {
            return res.status(409).json({ error: 'Username exists' });
        }
        
        // 检查邮箱是否已存在
        if (email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(409).json({ error: 'Email already registered' });
            }
        }
        
        // 创建新用户
        const password_hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password_hash,
            email: email || null,
            nickname: nickname || null,
            gender: gender || null,
            birth_date: birth_date || null,
            user_type: 'registered'
        });
        
        // 生成token
        const token = signToken({ userId: user.user_id, userType: 'registered' });
        res.json({ 
            token, 
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                nickname: user.nickname,
                gender: user.gender,
                birth_date: user.birth_date
            },
            // 添加协议同意状态
            agreed_to_terms: user.agreed_to_terms || false
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 查找用户
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 验证密码
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 更新最后登录时间
        await user.update({ last_login: new Date() });
        
        // 生成token
        const token = signToken({ userId: user.user_id, userType: 'registered' });
        res.json({ 
            token, 
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                nickname: user.nickname,
                gender: user.gender,
                birth_date: user.birth_date
            },
            // 添加协议同意状态
            agreed_to_terms: user.agreed_to_terms || false
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

// 获取用户个人信息
app.get('/api/users/profile', requireAuth, async (req, res) => {
    try {
        const auth = (req as any).auth as AuthPayload;
        
        // 检查用户是否为注册用户
        if (auth.userId === null) {
            return res.status(400).json({ error: '游客用户无个人资料' });
        }
        
        const user = await User.findByPk(auth.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            gender: user.gender,
            birth_date: user.birth_date,
            agreed_to_terms: user.agreed_to_terms
        });
    } catch (error) {
        console.error('获取用户资料错误:', error);
        res.status(500).json({ error: '获取用户资料失败' });
    }
});

// 更新用户协议同意状态
app.post('/api/users/agree-to-terms', requireAuth, async (req, res) => {
    try {
        const auth = (req as any).auth as AuthPayload;
        
        // 检查用户是否为注册用户
        if (auth.userId === null) {
            return res.status(400).json({ error: '游客用户无法同意协议' });
        }
        
        const user = await User.findByPk(auth.userId);
        
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        // 更新协议同意状态
        await user.update({ agreed_to_terms: true });
        
        res.json({ message: '协议同意状态更新成功' });
    } catch (error) {
        console.error('更新协议同意状态错误:', error);
        res.status(500).json({ error: '更新协议同意状态失败' });
    }
});

// 更新用户个人信息
app.put('/api/users/profile', requireAuth, async (req, res) => {
    try {
        const auth = (req as any).auth as AuthPayload;
        
        // 检查用户是否为注册用户
        if (auth.userId === null) {
            return res.status(400).json({ error: '游客用户无法更新个人资料' });
        }
        
        const { nickname, gender, birth_date, email } = req.body;
        
        const user = await User.findByPk(auth.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // 更新用户信息
        await user.update({
            nickname,
            gender,
            birth_date,
            email
        });
        
        res.json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            gender: user.gender,
            birth_date: user.birth_date,
            updated_at: user.updatedAt
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: '更新个人信息失败' });
    }
});

// AI咨询会话端点
interface ConsultationRequest {
  user_query: string;
  consultation_type: string;
}

interface ConsultationResponse {
  consultation_id?: string;
  ai_response: string;
  model_used: string;
  system_prompt?: string;
}

app.post('/api/consultations', requireAuth, async (req, res) => {
  try {
    const { user_query, consultation_type }: ConsultationRequest = req.body;
    
    // 验证请求参数
    if (!user_query) {
      return res.status(400).json({ 
        error: 'Missing required parameter: user_query' 
      });
    }
    
    // 确定要使用的AI模型类型
    let modelType = AIModelType.MOCK;
    const modelEnv = process.env.AI_MODEL_TYPE;
    
    console.log('环境变量检查:', { 
      AI_MODEL_TYPE: process.env.AI_MODEL_TYPE,
      GLM_API_KEY: process.env.GLM_API_KEY ? '[SET]' : '[NOT SET]',
      GLM_API_BASE: process.env.GLM_API_BASE
    });
    
    if (modelEnv === 'glm' || modelEnv === 'glm-4v') {
      modelType = modelEnv === 'glm-4v' ? AIModelType.GLM_4V : AIModelType.GLM;
    }
    
    // 调用AI模型
    const aiResponse = await callAIModel(user_query, modelType);
    
    // 返回AI响应
    const consultationResponse: ConsultationResponse = {
      ai_response: aiResponse.response,
      model_used: aiResponse.model
    };
    
    res.json(consultationResponse);
  } catch (error) {
    console.error('AI咨询错误:', error);
    res.status(500).json({ error: 'AI服务暂时不可用' });
  }
});

// 启动服务器前先初始化数据库
initializeDatabase().then(() => {
  // 启动服务器
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📄 Visit http://localhost:${PORT} to access the application`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 当前AI模型: ${process.env.AI_MODEL_TYPE || 'mock'}`);
    console.log('💡 提示: 设置环境变量 AI_MODEL_TYPE=glm 或 AI_MODEL_TYPE=glm-4v 来使用真实AI模型');
  });
}).catch(error => {
  console.error('应用启动失败:', error);
  process.exit(1);
});

// 导出应用实例，便于测试和复用
export default app;