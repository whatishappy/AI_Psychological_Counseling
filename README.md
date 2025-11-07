# AI心理咨询服务系统 (AI Psychological Counseling System)

## 项目简介

AI心理咨询服务系统是一个基于人工智能技术的心理健康支持平台，旨在为用户提供私密、便捷、专业的心理咨询服务。系统结合了现代Web技术和AI大模型，为用户打造了一个友好的心理健康支持环境。

## 功能特性

### 核心功能
1. **AI心理咨询服务**：基于认知行为疗法(CBT)的AI心理咨询师，24小时在线陪伴
2. **用户管理系统**：支持用户注册、登录、个人信息管理
3. **个性化服务**：根据用户信息提供个性化心理支持
4. **响应式界面**：适配各种设备屏幕，提供良好的用户体验

### 技术特色
- 前后端一体化设计
- 支持多种AI模型（GLM、MindChat等）
- 本地化部署，保护用户隐私
- SQLite数据库，轻量级部署

## 项目结构

```
AI_Psychological_Counseling/
├── APC_v2.0/                 # 主要开发版本
│   ├── demo/                 # 演示应用
│   │   ├── src/              # TypeScript源代码
│   │   ├── index.html        # 主页
│   │   ├── login.html        # 登录/注册页面
│   │   ├── profile.html      # 用户信息页面
│   │   └── simple-server.js  # 服务器入口
│   └── dist/                 # 编译后的代码
├── APC_v1.0/                 # 旧版本（存档）
└── README.md                 # 项目说明文件
```

## 技术栈

### 前端技术
- HTML5/CSS3/JavaScript
- 响应式设计
- 本地存储(LocalStorage)

### 后端技术
- Node.js
- TypeScript
- Express框架
- SQLite数据库
- Sequelize ORM

### AI集成
- 支持GLM系列模型
- 支持MindChat模型
- 可扩展的AI模型架构

## 快速开始

### 环境要求
- Node.js (推荐v16或更高版本)
- npm (通常随Node.js一起安装)

### 安装步骤

1. 克隆项目到本地：
```bash
git clone <项目地址>
```

2. 进入项目目录：
```bash
cd AI_Psychological_Counseling/APC_v2.0/demo
```

3. 安装依赖：
```bash
npm install
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 访问应用：
在浏览器中打开 `http://localhost:3000`

### 生产部署

1. 编译TypeScript代码：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm start
```

## 使用指南

### 用户流程
1. 访问首页，点击"开始聊天"
2. 新用户需要注册账户，老用户直接登录
3. 登录后可完善个人信息（昵称、性别、出生日期等）
4. 进入聊天界面，与AI心理咨询师进行对话
5. 通过右上角用户菜单可访问个人信息或退出登录

### AI模型配置
系统默认使用模拟AI模型，如需使用真实AI模型：

1. 设置环境变量：
```bash
export AI_MODEL_TYPE=glm        # 或 glm-4v
export ZHIPUAI_API_KEY=your_key # 智谱AI API密钥
```

2. 重启服务器

## API接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 聊天接口
- `POST /api/chat` - 与AI模型对话

### 用户接口
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息

## 开发说明

### 项目配置
- 使用TypeScript进行后端开发
- 遵循RESTful API设计原则
- 数据库使用Sequelize ORM

### 代码规范
- 使用ESLint进行代码检查
- 遵循TypeScript最佳实践
- 保持代码结构清晰

### 扩展开发
1. 添加新的AI模型支持：扩展[aiService.ts](file://d:/github%E4%BB%A3%E7%A0%81%E5%AD%98%E6%94%BE%E5%A4%84/clone%E6%9C%AC%E5%9C%B0%E4%BB%A3%E7%A0%81%E5%BA%93/AI_Psychological_Counseling/APC_v2.0/demo/src/aiService.ts)中的模型接口
2. 添加新的功能模块：在[src/](file://d:/github%E4%BB%A3%E7%A0%81%E5%AD%98%E6%94%BE%E5%A4%84/clone%E6%9C%AC%E5%9C%B0%E4%BB%A3%E7%A0%81%E5%BA%93/AI_Psychological_Counseling/APC_v2.0/demo/src/)目录下添加新的服务和路由
3. 前端优化：修改HTML/CSS/JavaScript文件以改善用户体验

## 注意事项

1. 请勿通过file://协议直接打开HTML文件，必须通过HTTP服务器访问
2. 用户认证使用JWT Token，需在请求头中添加Authorization字段
3. 生产环境建议配置HTTPS以保护用户隐私
4. 数据库文件会自动生成在项目目录中

## 贡献指南

欢迎提交Issue和Pull Request来改进项目。在贡献代码前，请确保：

1. 遵循项目代码规范
2. 添加必要的测试用例
3. 更新相关文档

## 许可证

[待定]

## 联系方式

如有问题或建议，请提交Issue或通过以下方式联系：

- 项目维护者：[待定]
- 邮箱：[待定]