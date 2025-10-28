const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 简化的登录API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // 简单验证 - 实际项目中应该查询数据库
  if (username && password) {
    // 模拟生成token
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJUeXBlIjoicmVnaXN0ZXJlZCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 简化的注册API
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  
  // 简单验证
  if (username && password && username.length >= 3 && password.length >= 6) {
    // 模拟生成token
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJUeXBlIjoicmVnaXN0ZXJlZCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Invalid username or password' });
  }
});

// 健康检查端点
app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// 所有其他路由都返回index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});