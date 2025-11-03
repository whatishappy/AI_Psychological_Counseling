/**
 * AI心理咨询服务主应用文件
 * 这是使用TypeScript编写的Express应用入口点
 */

import express from 'express';
import path from 'path';

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
});

// 导出应用实例，便于测试和复用
export default app;