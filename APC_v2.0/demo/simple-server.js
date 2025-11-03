/**
 * 简易开发服务器
 * 用于快速启动和测试前端页面
 * 注意：此服务器仅为开发和演示用途，不应在生产环境中使用
 */

const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes, Model } = require('sequelize');

// 初始化 Sequelize 实例（使用内存数据库用于演示）
const sequelize = new Sequelize('sqlite::memory:', { 
  logging: false,
  storage: ':memory:'
});

// GLM API 密钥和URL
const GLM_API_KEY = '5176ce390ab84303aa7dae35d3be6f6a.JqWhdfhvZAhKIJCd';
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// 定义 User 模型
class User extends Model {}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false
});

// 定义 Consultation 模型（聊天记录）
class Consultation extends Model {}

Consultation.init({
  consultation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  user_query: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ai_response: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  consultation_type: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Consultation',
  tableName: 'consultations',
  timestamps: true
});

// 建立模型间的关系
User.hasMany(Consultation, { foreignKey: 'user_id' });
Consultation.belongsTo(User, { foreignKey: 'user_id' });

const app = express();
// 从环境变量获取端口号，默认为3000
const PORT = process.env.PORT || 3000;

// 盐值轮数，用于bcrypt哈希
const SALT_ROUNDS = 10;

// 中间件配置
// 解析JSON请求体
app.use(express.json());
// 提供静态文件服务，将当前目录作为静态资源根目录
app.use(express.static(path.join(__dirname)));

// 简化的登录API端点
// 实际验证用户凭据
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Username and password are required' 
      });
    }
    
    // 查询用户
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }
    
    // 使用bcrypt比较密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }
    
    // 模拟生成JWT令牌
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJUeXBlIjoicmVnaXN0ZXJlZCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    res.json({ 
      success: true,
      token,
      user: {
        user_id: user.user_id,
        username: user.username
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// 简化的注册API端点
// 实际保存用户信息到数据库
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 简单验证
    if (!username || !password || username.length < 3 || password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid username or password. Username must be at least 3 characters and password at least 6 characters.'
      });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Username already exists'
      });
    }
    
    // 使用bcrypt哈希密码
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // 创建新用户
    const newUser = await User.create({ 
      username, 
      password_hash: hashedPassword
    });
    
    // 模拟生成JWT令牌
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJUeXBlIjoicmVnaXN0ZXJlZCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    res.json({ 
      success: true,
      token,
      user: {
        user_id: newUser.user_id,
        username: newUser.username
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// 聊天咨询API端点
app.post('/api/consultations', async (req, res) => {
  try {
    const { user_query, consultation_type } = req.body;
    
    let ai_response;
    
    // 调用GLM模型
    try {
      // 心理咨询师系统提示词
      const systemPrompt = "你是一个专业的心理辅导师，你的任务是为用户提供心理支持和帮助。请以温和、理解和支持的态度回应用户的问题。";
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
      
      const response = await fetch(GLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GLM_API_KEY}`
        },
        body: JSON.stringify({
          model: 'glm-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: user_query }
          ],
          temperature: 0.8,
          top_p: 0.7,
          stream: false
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          ai_response = data.choices[0].message.content;
        } else {
          // 如果API调用失败，使用模拟响应
          console.error('GLM API返回空响应:', data);
          ai_response = getSimulatedResponse();
        }
      } else {
        console.error('GLM API错误响应:', await response.text());
        // 如果API调用失败，使用模拟响应
        ai_response = getSimulatedResponse();
      }
    } catch (apiError) {
      if (apiError.name === 'AbortError') {
        console.error('GLM API调用超时');
        ai_response = "抱歉，AI模型响应超时，请稍后重试。";
      } else {
        console.error('GLM API调用错误:', apiError);
        // 如果API调用失败，使用模拟响应
        ai_response = getSimulatedResponse();
      }
    }
    
    // 返回AI响应
    res.json({ 
      success: true,
      user_query,
      ai_response,
      consultation_type
    });
  } catch (error) {
    console.error('Consultation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// 获取模拟响应的辅助函数
function getSimulatedResponse() {
  const ai_responses = [
    "谢谢你的分享。能告诉我更多关于这件事的感受吗？",
    "我理解你的感受。这种情况确实会让人感到压力。",
    "听起来你现在面临一些挑战。我们可以一起探讨一下应对的方法。",
    "你的感受是完全可以理解的。很多人都会在类似情况下感到焦虑。",
    "感谢你愿意分享这些。让我们一起看看如何改善这种情况。"
  ];
  
  return ai_responses[Math.floor(Math.random() * ai_responses.length)];
}

// 健康检查端点
// 用于检查服务是否正常运行
app.get('/health', (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    service: 'AI Psychology Platform - Simple Server'
  });
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
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// 启动服务器
const PORT = process.env.PORT || 3001; // 更改端口为3001避免冲突

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
    
    // 显示当前使用的AI模型
    const modelEnv = process.env.AI_MODEL_TYPE || 'mock';
    console.log(`Current AI model: ${modelEnv}`);
    
    if (modelEnv === 'mock') {
        console.log('Tip: Set AI_MODEL_TYPE=glm or AI_MODEL_TYPE=glm-4v to use real AI models');
    }
});

module.exports = app;