# AI 心理咨询与运动计划平台 - 后端 (TypeScript/Express + MySQL)

一个基于AI的心理健康服务平台后端，提供心理咨询、个性化锻炼计划、健康评估等功能。

## 🌟 功能特性

- 用户认证系统（注册、登录、游客访问）
- AI驱动的心理咨询服务
- 个性化锻炼计划生成与管理
- 身体和心理状态评估
- 身体测量数据追踪
- 管理员功能（用户管理、登录日志查看）

## 🔧 技术栈

- [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/) Web框架
- [Sequelize ORM](https://sequelize.org/) 数据库操作
- [MySQL](https://www.mysql.com/) 数据库
- [JWT](https://jwt.io/) 用户认证
- [Axios](https://axios-http.com/) HTTP客户端
- AI集成（可配置MindChat、GLM等模型）

## 📋 环境要求

- Node.js >= 16
- MySQL >= 5.7
- npm 或 yarn

## 📁 项目结构说明

```
APC_v2.0/
├── demo/                    # 主要开发目录
│   ├── src/                 # TypeScript源代码
│   │   └── app.ts           # 应用主入口文件
│   ├── migrations/          # 数据库迁移文件
│   ├── scripts/             # 脚本文件
│   ├── dist/                # 编译后的JavaScript文件
│   ├── package.json         # 演示目录的配置文件（指向根目录依赖）
│   ├── tsconfig.json        # TypeScript配置
│   ├── simple-server.js     # 简易开发服务器
│   ├── index.html           # 前端主页面
│   └── ...                  # 其他配置和资源文件
├── package.json             # 项目根目录配置文件（统一管理所有依赖项）
└── tsconfig.json            # 根目录TypeScript配置
```

注意：项目依赖项已统一在根目录的 package.json 中管理，避免重复安装 node_modules。demo 目录中的 package.json 仅包含项目特定的元数据和脚本。

## 🚀 快速启动

### 1. 安装依赖
```bash
# 在项目根目录安装依赖（推荐）
npm install

# 注意：不要在demo目录单独安装依赖，这会导致重复的node_modules
```

### 2. 配置环境变量
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

### 3. 初始化数据库
1. 启动 MySQL 服务
2. 创建数据库：`CREATE DATABASE ai_psychology_platform;`
3. 执行提供的 DDL 脚本创建表结构

### 4. 启动服务
```bash
# 在项目根目录启动（推荐）
npm run dev

# 或者在demo目录启动
cd demo
npm run dev
```
服务将在 `http://localhost:3000` 启动

### 5. 初始化管理员（可选）
```bash
npm run seed:admin
```
默认管理员账号：
- 用户名：admin
- 邮箱：admin@example.com  
- 密码：ChangeMe123!
- 角色：super_admin

## 📖 API接口文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/guest` - 游客访问

### 心理咨询
- `POST /api/consultations/` - 创建咨询会话
- `GET /api/consultations/` - 获取用户咨询历史

### 锻炼计划
- `GET /api/plans/` - 获取用户锻炼计划列表
- `POST /api/plans/` - 创建锻炼计划
- `GET /api/plans/:id` - 获取特定锻炼计划
- `PUT /api/plans/:id` - 更新锻炼计划
- `DELETE /api/plans/:id` - 删除锻炼计划
- `POST /api/consultations/:id/plan` - 基于咨询会话创建锻炼计划

### 身体测量
- `GET /api/measurements/` - 获取身体测量数据
- `POST /api/measurements/` - 创建身体测量记录
- `PUT /api/measurements/:id` - 更新身体测量记录
- `DELETE /api/measurements/:id` - 删除身体测量记录

### 健康评估
- `GET /api/assessments/psych` - 获取心理评估记录
- `POST /api/assessments/psych` - 创建心理评估记录
- `GET /api/assessments/physical` - 获取身体评估记录
- `POST /api/assessments/physical` - 创建身体评估记录

### 管理员功能
- `GET /api/admin/logins` - 查看用户登录日志
- `GET /api/admin/users` - 查看用户列表

## 📁 项目结构

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

## 🛠️ 开发命令

```bash
# 启动开发服务器
npm run dev

# 启动带调试功能的开发服务器
npm run dev:debug

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 初始化管理员账户
npm run seed:admin
```

## ✅ 代码质量

```bash
# 运行代码检查
npm run lint

# 自动修复代码风格问题
npm run lint:fix

# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## 🗄️ 数据库设计

项目使用MySQL数据库，包含以下主要表：

- users: 用户信息
- consultation_sessions: 咨询会话
- consultation_messages: 咨询消息记录
- exercise_plans: 锻炼计划
- body_measurements: 身体测量数据
- psychological_assessments: 心理评估
- physical_assessments: 身体评估
- user_login_logs: 用户登录日志

## 🧪 测试

使用Jest进行单元测试和集成测试。

```bash
# 运行所有测试
npm test

# 运行测试并监听文件变化
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

## 🚢 部署

构建项目并运行生产服务器:

```bash
npm run build
npm start
```

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📄 许可证

[MIT](LICENSE)

# AI心理咨询服务系统 v2.0

这是一个基于AI的心理咨询服务系统，提供7x24小时的心理健康支持。

## 功能特性

- 用户注册和登录
- AI心理咨询服务（基于大语言模型）
- 用户协议和隐私协议管理
- 个人信息管理
- 基于JWT的身份验证

## 技术栈

- 后端：Node.js + Express + TypeScript
- 数据库：MySQL
- ORM：Sequelize
- 前端：HTML + CSS + JavaScript
- AI服务：支持多种大语言模型（Qwen, GLM等）

## 快速开始

### 1. 环境要求

- Node.js >= 14
- MySQL >= 5.7
- npm >= 6

### 2. 安装依赖

```bash
npm install
```

### 3. 数据库设置

有两种方式设置数据库：

#### 自动设置（推荐）

1. 复制配置文件：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，配置数据库连接信息：
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=apc_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   ```

3. 运行数据库初始化脚本：
   ```bash
   npm run init:db
   ```

#### 手动设置

参考 [DATABASE_SETUP.md](DATABASE_SETUP.md) 文件进行手动数据库设置。

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

## 项目结构

```
.
├── src/                 # TypeScript源代码
│   ├── app.ts          # 应用入口
│   ├── models/         # 数据库模型
│   ├── aiService.ts    # AI服务接口
│   └── types/          # TypeScript类型定义
├── index.html          # 主页
├── profile.html        # 用户信息页面
├── login.html          # 登录页面
├── .env                # 环境变量配置
├── .env.example        # 环境变量配置示例
└── package.json        # 项目配置
```

## 数据库模型

### User 模型

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | INTEGER | 用户ID |
| username | STRING | 用户名 |
| email | STRING | 邮箱 |
| password_hash | STRING | 密码哈希 |
| user_type | ENUM | 用户类型（registered, admin）|
| last_login | DATE | 最后登录时间 |
| agreed_to_terms | BOOLEAN | 是否同意用户协议 |
| nickname | STRING | 昵称（可选）|
| gender | ENUM | 性别（male, female, other）|
| birth_date | DATE | 出生日期 |

## API 接口

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户接口

- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `POST /api/users/agree-to-terms` - 同意用户协议

### AI服务接口

- `POST /api/ai/chat` - 与AI对话

## 环境变量

项目使用以下环境变量：

| 变量名 | 描述 | 是否必需 |
|--------|------|---------|
| DB_HOST | 数据库主机 | 是 |
| DB_PORT | 数据库端口 | 是 |
| DB_NAME | 数据库名 | 是 |
| DB_USER | 数据库用户 | 是 |
| DB_PASSWORD | 数据库密码 | 是 |
| JWT_SECRET | JWT密钥 | 是 |
| DASHSCOPE_API_KEY | 通义千问API密钥 | 否 |
| ZHIPUAI_API_KEY | 智谱AI API密钥 | 否 |

## 开发指南

### 代码规范

- 使用TypeScript编写后端代码
- 遵循RESTful API设计原则
- 使用ESLint进行代码检查

### 数据库迁移

当修改数据库模型时，需要同步数据库结构：

```bash
npm run dev
```

开发模式下会自动同步模型更改。

## 部署

1. 构建项目：
   ```bash
   npm run build
   ```

2. 设置生产环境变量

3. 启动服务器：
   ```bash
   npm start
   ```

## 故障排除

### 数据库连接问题

1. 检查MySQL服务是否运行
2. 验证环境变量配置是否正确
3. 确认数据库用户权限是否正确

### 启动端口冲突

如果3000端口被占用，可以修改端口：

```bash
PORT=4000 npm run dev
```

## 许可证

MIT
