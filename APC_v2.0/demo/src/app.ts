/**
 * AI心理咨询服务主应用文件
 * 这是使用TypeScript编写的Express应用入口点
 */

import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { callAIModel, AIModelType } from './aiService';

// 定义支持的AI模型类型（已从aiService导入，此处不再重复定义）

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
    const token = header.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        (req as any).auth = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// 模拟用户数据存储
interface User {
    user_id: number;
    username: string;
    password_hash: string;
    email?: string;
    user_type: 'registered' | 'admin';
    last_login?: Date;
}

// 模拟数据库存储
const users: User[] = [];
let nextUserId = 1;

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
        const { username, password, email } = req.body;
        
        // 检查用户名是否已存在
        const existing = users.find(u => u.username === username);
        if (existing) {
            return res.status(409).json({ error: 'Username exists' });
        }
        
        // 检查邮箱是否已存在
        if (email) {
            const existingEmail = users.find(u => u.email === email);
            if (existingEmail) {
                return res.status(409).json({ error: 'Email already registered' });
            }
        }
        
        // 创建新用户
        const password_hash = await bcrypt.hash(password, 10);
        const user: User = {
            user_id: nextUserId++,
            username,
            password_hash,
            email,
            user_type: 'registered'
        };
        users.push(user);
        
        // 生成token
        const token = signToken({ userId: user.user_id, userType: 'registered' });
        res.json({ token, user: { user_id: user.user_id, username, email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 查找用户
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 验证密码
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 更新最后登录时间
        user.last_login = new Date();
        
        // 生成token
        const token = signToken({ userId: user.user_id, userType: 'registered' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

app.post('/api/auth/guest', async (req, res) => {
    try {
        // 生成游客token
        const token = signToken({ userId: null, userType: 'guest' }, '1d');
        res.json({ token });
    } catch (error) {
        console.error('Guest login error:', error);
        res.status(500).json({ error: 'Guest login failed' });
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
      ZHIPUAI_API_KEY: process.env.ZHIPUAI_API_KEY ? '已设置' : '未设置'
    });
    
    if (modelEnv === 'glm') {
      modelType = AIModelType.GLM;
      console.log('使用GLM模型');
    } else if (modelEnv === 'glm-4v') {
      modelType = AIModelType.GLM_4V;
      console.log('使用GLM-4V模型');
    } else {
      console.log('使用MOCK模型，因为AI_MODEL_TYPE设置为:', modelEnv);
    }
    
    // 调用AI模型获取回复
    const aiResponse = await callAIModel(user_query, modelType);
    
    const response: ConsultationResponse = {
      consultation_id: 'sess-' + Date.now(),
      ai_response: aiResponse.response,
      model_used: aiResponse.model,
      system_prompt: '系统提示词已设置（不显示给用户）'
    };
    
    console.log('AI响应详情:', {
      model_used: aiResponse.model,
      response_preview: aiResponse.response.substring(0, 100) + '...'
    });
    
    console.log('系统提示词已设置（不显示给用户）');
    
    // 返回AI响应
    res.json(response);
  } catch (error) {
    console.error('AI咨询处理错误:', error);
    res.status(500).json({ 
      error: 'Internal server error while processing consultation' 
    });
  }
});

// 所有其他GET请求都返回index.html
// 支持前端路由（如Vue、React的Browser History模式）
app.get('*', (req, res) => {
  // 如果请求的是API端点但未找到，返回404
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ 
      error: 'API endpoint not found' 
    });
  } else {
    // 否则返回主页面，支持SPA应用
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
});

// 启动服务器并监听指定端口
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📄 Visit http://localhost:${PORT} to access the application`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  
  // 显示当前使用的AI模型
  const modelEnv = process.env.AI_MODEL_TYPE || 'mock';
  console.log(`🤖 当前AI模型: ${modelEnv}`);
  if (modelEnv === 'mock') {
    console.log('💡 提示: 设置环境变量 AI_MODEL_TYPE=glm 或 AI_MODEL_TYPE=glm-4v 来使用真实AI模型');
  }
});

// 导出应用实例，便于测试和复用
export default app;