/**
 * AI心理咨询服务主应用文件
 * 这是使用TypeScript编写的Express应用入口点
 */

import express from 'express';
import path from 'path';
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

app.post('/api/consultations', async (req, res) => {
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
    
    if (modelEnv === 'glm') {
      modelType = AIModelType.GLM;
    } else if (modelEnv === 'glm-4v') {
      modelType = AIModelType.GLM_4V;
    }
    
    // 调用AI模型获取回复
    const aiResponse = await callAIModel(user_query, modelType);
    
    const response: ConsultationResponse = {
      consultation_id: 'sess-' + Date.now(),
      ai_response: aiResponse.response,
      model_used: aiResponse.model,
      system_prompt: '系统提示词已设置（不显示给用户）'
    };
    
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