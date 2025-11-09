const http = require('http');

// 先登录获取token
const loginData = JSON.stringify({
  username: 'testuser2',
  password: 'password123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, res => {
  let responseData = '';
  
  res.on('data', chunk => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    const loginResult = JSON.parse(responseData);
    console.log('登录结果:', loginResult);
    
    if (loginResult.token) {
      // 使用token调用同意协议接口
      const agreeOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/users/agree-to-terms',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginResult.token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const agreeReq = http.request(agreeOptions, res => {
        console.log(`同意协议状态码: ${res.statusCode}`);
        
        res.on('data', d => {
          process.stdout.write(d);
        });
      });
      
      agreeReq.on('error', error => {
        console.error('同意协议请求错误:', error);
      });
      
      agreeReq.end();
    }
  });
});

loginReq.on('error', error => {
  console.error('登录请求错误:', error);
});

loginReq.write(loginData);
loginReq.end();