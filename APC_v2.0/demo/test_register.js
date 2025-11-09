const http = require('http');

const data = JSON.stringify({
  username: 'testuser2',
  password: 'password123',
  email: 'test2@example.com'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`状态码: ${res.statusCode}`);
  
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('请求错误:', error);
});

req.write(data);
req.end();