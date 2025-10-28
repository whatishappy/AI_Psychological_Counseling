## AI 心理咨询与运动计划平台 - 后端 (TypeScript/Express + MySQL)

### 🚀 快速启动

#### 1. 安装依赖
```bash
npm install
```

#### 2. 配置环境变量
创建 `.env` 文件（在项目根目录）：
```
PORT=3000
JWT_SECRET=your-secret-key-here
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=ai_psychology_platform

# 可选：接入 GLM AI
GLM_API_BASE=https://open.bigmodel.cn/api/paas/v4
GLM_API_KEY=your-glm-api-key
GLM_MODEL=glm-4

```

#### 3. 初始化数据库
1. 启动 MySQL 服务
2. 创建数据库：`CREATE DATABASE ai_psychology_platform;`
3. 执行提供的 DDL 脚本创建表结构

#### 4. 启动服务
```bash
npm run dev
```
服务将在 `http://localhost:3000` 启动

#### 5. 初始化管理员（可选）
```bash
npm run seed:admin
```
默认管理员账号：
- 用户名：admin
- 邮箱：admin@example.com  
- 密码：ChangeMe123!
- 角色：super_admin

### 📋 Apipost 接口测试指南

#### 环境配置
1. 创建新的 Apipost 项目：`AI心理咨询平台`
2. 创建环境变量：
   - 点击左侧「环境」→「新建环境」
   - 环境名称：`开发环境`
   - 添加变量：
     - `base_url`: `http://localhost:3000`
     - `token`: (登录后手动更新)

#### 🔐 认证接口测试

##### 1. 健康检查
- **步骤**：
  1. 创建新接口，选择 GET 方法
  2. 填写 URL：`{{base_url}}/health`
  3. 点击「发送」
- **预期响应**: `{"ok": true}`

##### 2. 游客登录
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/auth/guest`
  3. Headers 添加：`Content-Type: application/json`
  4. Body 选择 raw → JSON，内容：`{}`
  5. 点击「发送」
- **预期响应**: `{"token": "eyJ..."}`
- **后续操作**: 
  1. 复制响应中的 token 值
  2. 在环境变量中更新 `token` 的值

##### 3. 用户注册
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/auth/register`
  3. Headers 添加：`Content-Type: application/json`
  4. Body 选择 raw → JSON，内容：
```json
{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com",
  "nickname": "测试用户"
}
```
  5. 点击「发送」
- **预期响应**: `{"token": "eyJ...", "user": {...}}`

##### 4. 用户登录
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/auth/login`
  3. Headers 添加：`Content-Type: application/json`
  4. Body 选择 raw → JSON，内容：
```json
{
  "username": "testuser",
  "password": "123456"
}
```
  5. 点击「发送」
- **预期响应**: `{"token": "eyJ..."}`

#### 🧠 咨询接口测试

##### 5. 创建咨询会话（游客）
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/consultations`
  3. Headers 添加：
     - `Content-Type: application/json`
     - `Authorization: Bearer {{token}}`
  4. Body 选择 raw → JSON，内容：
```json
{
  "user_query": "最近学习压力很大，经常失眠，怎么办？",
  "consultation_type": "psychological",
  "mood_rating": 6,
  "base_profile": {
    "age": 18,
    "gender": "female",
    "weight": 55
  }
}
```
  5. 点击「发送」
- **预期响应**: 
```json
{
  "session": {...},
  "ai_response": "基于你的描述，我建议...",
  "plan_preview": {...}
}
```

##### 6. 创建咨询会话（注册用户）
- **步骤**：同上（使用注册用户的 token）
- **预期响应**: 只返回 `session` 和 `ai_response`，无 `plan_preview`

##### 7. 查看咨询历史
- **步骤**：
  1. 创建新接口，选择 GET 方法
  2. 填写 URL：`{{base_url}}/api/consultations`
  3. Headers 添加：`Authorization: Bearer {{token}}`
  4. 点击「发送」
- **预期响应**: 咨询会话列表

##### 8. 基于会话创建运动计划
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/consultations/1/plan`（替换 1 为实际 session_id）
  3. Headers 添加：
     - `Content-Type: application/json`
     - `Authorization: Bearer {{token}}`
  4. Body 选择 raw → JSON，内容：
```json
{
  "plan_name": "减压运动计划",
  "plan_description": "针对学习压力的运动方案",
  "plan_content": {
    "weeks": 4,
    "schedule": [
      {"week": 1, "sessions": [
        {"day": "Mon", "type": "cardio", "minutes": 30, "intensity": "low"}
      ]}
    ],
    "caloriesTarget": 1500
  },
  "duration_weeks": 4,
  "intensity_level": "medium"
}
```
  5. 点击「发送」

#### 💪 运动计划管理

##### 9. 查看运动计划列表
- **步骤**：
  1. 创建新接口，选择 GET 方法
  2. 填写 URL：`{{base_url}}/api/plans`
  3. Headers 添加：`Authorization: Bearer {{token}}`
  4. 点击「发送」

##### 10. 创建运动计划
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/plans`
  3. Headers 添加：
     - `Content-Type: application/json`
     - `Authorization: Bearer {{token}}`
  4. Body 选择 raw → JSON，内容：
```json
{
  "plan_name": "晨练计划",
  "plan_description": "每日晨练30分钟",
  "plan_content": {
    "exercises": ["跑步", "拉伸", "瑜伽"],
    "duration": 30,
    "frequency": "daily"
  }
}
```
  5. 点击「发送」

##### 11. 更新运动计划
- **步骤**：
  1. 创建新接口，选择 PUT 方法
  2. 填写 URL：`{{base_url}}/api/plans/1`（替换 1 为实际 plan_id）
  3. Headers 添加：
     - `Content-Type: application/json`
     - `Authorization: Bearer {{token}}`
  4. Body 选择 raw → JSON，内容：更新的计划数据
  5. 点击「发送」

#### 📊 身体数据管理

##### 12. 记录身体数据
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/measurements`
  3. Headers 添加：
     - `Content-Type: application/json`
     - `Authorization: Bearer {{token}}`
  4. Body 选择 raw → JSON，内容：
```json
{
  "weight": 65.5,
  "height": 170.0,
  "waist_circumference": 75.0,
  "measurement_date": "2024-01-15",
  "notes": "本周测量"
}
```
  5. 点击「发送」

##### 13. 查看身体数据趋势
- **步骤**：
  1. 创建新接口，选择 GET 方法
  2. 填写 URL：`{{base_url}}/api/measurements`
  3. Headers 添加：`Authorization: Bearer {{token}}`
  4. 点击「发送」

#### 🧘 评估接口

##### 14. 心理评估
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/assessments/psych`
  3. Headers 添加：
     - `Content-Type: application/json`
     - `Authorization: Bearer {{token}}`
  4. Body 选择 raw → JSON，内容：
```json
{
  "assessment_date": "2024-01-15",
  "stress_level": 7,
  "anxiety_level": 6,
  "sleep_quality": 5,
  "social_support": 8
}
```
  5. 点击「发送」

##### 15. 体质评估
- **步骤**：
  1. 创建新接口，选择 POST 方法
  2. 填写 URL：`{{base_url}}/api/assessments/physical`
  3. Headers 添加：
     - `Content-Type: application/json`
     - `Authorization: Bearer {{token}}`
  4. Body 选择 raw → JSON，内容：
```json
{
  "assessment_date": "2024-01-15",
  "cardiovascular_level": 7,
  "strength_level": 6,
  "flexibility_level": 8,
  "endurance_level": 7
}
```
  5. 点击「发送」

#### 👨‍💼 管理员接口

##### 16. 查看登录记录
- **步骤**：
  1. 创建新接口，选择 GET 方法
  2. 填写 URL：`{{base_url}}/api/admin/logins`
  3. Headers 添加：`Authorization: Bearer {{token}}`
  4. 点击「发送」

##### 17. 查看用户列表
- **步骤**：
  1. 创建新接口，选择 GET 方法
  2. 填写 URL：`{{base_url}}/api/admin/users`
  3. Headers 添加：`Authorization: Bearer {{token}}`
  4. 点击「发送」

### 🔧 技术栈
- TypeScript + Express + Helmet + CORS
- Sequelize (MySQL)
- JWT 鉴权（支持游客 token）
- Axios (HTTP 客户端)
- MindChat AI 集成

### 📁 目录结构
```
src/
  app.ts                 # 应用入口
  db/sequelize.ts        # 数据库连接
  models/index.ts        # 数据模型
  middleware/auth.ts     # JWT 中间件
  services/
    ai.ts               # AI 服务
    mindchat.ts         # MindChat 客户端
  routes/               # 路由模块
    auth.ts             # 认证路由
    consultations.ts    # 咨询路由
    plans.ts            # 运动计划路由
    measurements.ts     # 身体数据路由
    assessments.ts      # 评估路由
    admin.ts            # 管理路由
```

### 📝 Apipost 使用技巧

#### 环境变量管理
1. **设置环境变量**：
   - 点击左侧「环境」→ 选择「开发环境」
   - 在变量列表中添加或编辑变量值
   - 例如：`token` 的值在登录后需要手动更新

2. **使用环境变量**：
   - 在 URL 中使用 `{{base_url}}`
   - 在 Headers 中使用 `{{token}}`
   - Apipost 会自动替换变量值

#### 接口测试顺序建议
1. **基础测试**：健康检查 → 游客登录 → 获取 token
2. **认证测试**：用户注册 → 用户登录 → 更新 token
3. **核心功能**：咨询会话 → 运动计划 → 身体数据
4. **高级功能**：评估接口 → 管理员接口

#### 常见问题排查
1. **401 Unauthorized**：检查 token 是否正确设置
2. **404 Not Found**：检查 URL 路径是否正确
3. **500 Internal Server Error**：检查数据库连接和 `.env` 配置
4. **JSON 格式错误**：确保 Body 选择 raw → JSON 格式

### ⚠️ 注意事项
1. 所有需要认证的接口都需要在 Header 中添加 `Authorization: Bearer {{token}}`
2. 游客只能进行咨询，无法保存运动计划
3. 注册用户可以进行所有操作
4. 确保数据库已正确初始化
5. 如果 MindChat API 未配置，会使用内置的占位建议
6. 测试时请按照接口顺序进行，确保前置条件满足

# AI Psychology Platform Backend

一个基于AI的心理健康服务平台后端，提供心理咨询、锻炼计划、健康评估等功能。

## 功能特性

- 心理健康AI咨询
- 个性化锻炼计划生成
- 心理和身体评估
- 用户认证和管理
- 身体测量数据追踪

## 技术栈

- Node.js + TypeScript
- Express.js
- Sequelize ORM
- MySQL
- MindChat AI模型

## 环境要求

- Node.js >= 16
- MySQL >= 5.7
- npm 或 yarn

## 安装和设置

1. 克隆项目:
   ```
   git clone <repository-url>
   cd ai-psychology-platform-backend
   ```

2. 安装依赖:
   ```
   npm install
   ```

3. 配置环境变量:
   创建 `.env` 文件并配置以下变量:
   ```
   # MindChat API配置
   MINDCHAT_API_KEY=your_api_key
   MINDCHAT_API_BASE=https://api.modelscope.cn/v1
   MINDCHAT_MODEL=mindchat
   
   # 数据库配置
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=ai_psychology_platform
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # JWT密钥
   JWT_SECRET=your_jwt_secret
   
   # 服务器端口
   PORT=3000
   ```

4. 初始化数据库:
   ```
   npm run build
   ```

## 开发

```
# 启动开发服务器
npm run dev

# 启动带调试功能的开发服务器
npm run dev:debug

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 代码质量

```
# 运行代码检查
npm run lint

# 自动修复代码风格问题
npm run lint:fix

# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## API接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/guest` - 游客访问

### 咨询会话
- `POST /api/consultations/` - 创建咨询会话
- `GET /api/consultations/` - 获取用户咨询历史
- `POST /api/consultations/:id/plan` - 基于会话创建锻炼计划

### 锻炼计划
- `GET /api/plans/` - 获取用户锻炼计划
- `POST /api/plans/` - 创建锻炼计划
- `GET /api/plans/:id` - 获取特定锻炼计划
- `PUT /api/plans/:id` - 更新锻炼计划
- `DELETE /api/plans/:id` - 删除锻炼计划

### 身体测量
- `GET /api/measurements/` - 获取身体测量数据
- `POST /api/measurements/` - 创建身体测量记录
- `PUT /api/measurements/:id` - 更新身体测量记录
- `DELETE /api/measurements/:id` - 删除身体测量记录

### 健康评估
- `GET /api/assessments/psych` - 获取心理评估
- `POST /api/assessments/psych` - 创建心理评估
- `GET /api/assessments/physical` - 获取身体评估
- `POST /api/assessments/physical` - 创建身体评估

## 数据库设计

项目使用MySQL数据库，包含以下主要表：

- users: 用户信息
- consultation_sessions: 咨询会话
- exercise_plans: 锻炼计划
- body_measurements: 身体测量数据
- psychological_assessments: 心理评估
- physical_assessments: 身体评估
- user_login_logs: 用户登录日志

## 测试

使用Jest进行单元测试和集成测试。

```
# 运行所有测试
npm test

# 运行测试并监听文件变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

## 部署

构建项目并运行生产服务器:

```
npm run build
npm start
```

## 贡献

欢迎提交Issue和Pull Request来改进项目。

## 许可证

[MIT](LICENSE)
