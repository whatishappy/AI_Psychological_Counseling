# 数据库设置指南

本文档介绍了如何使用自动化脚本设置项目所需的数据库环境。

## 前置条件

1. 确保已安装 MySQL 服务并正在运行
2. 确保已安装 Node.js (版本 >= 14)
3. 确保已在项目根目录下安装了依赖项:
   ```bash
   npm install
   ```

## 自动化数据库设置

项目提供了一个自动化脚本用于创建数据库和用户，您可以通过以下步骤使用:

### 1. 配置环境变量

在运行脚本之前，请确保配置了正确的环境变量。您可以通过以下任一方式配置:

#### 方法一：使用 .env 文件 (推荐)

在 `demo` 目录下创建 `.env` 文件，包含以下内容:

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=apc_db
DB_USER=apc_user
DB_PASSWORD=your_secure_password

# 可选：如果需要使用root账户创建数据库和用户
DB_ROOT_PASSWORD=your_root_password
```

#### 方法二：使用环境变量

在运行脚本前设置环境变量:

```bash
# Windows (cmd)
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=apc_db
set DB_USER=apc_user
set DB_PASSWORD=your_secure_password

# Windows (PowerShell)
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="apc_db"
$env:DB_USER="apc_user"
$env:DB_PASSWORD="your_secure_password"

# macOS/Linux
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=apc_db
export DB_USER=apc_user
export DB_PASSWORD=your_secure_password
```

### 2. 运行数据库初始化脚本

在 `demo` 目录下运行以下命令:

```bash
npm run init:db
```

脚本将执行以下操作:
1. 连接到 MySQL 服务器
2. 创建指定的数据库（如果尚不存在）
3. 创建指定的数据库用户（如果尚不存在）
4. 为用户授予对数据库的完全权限
5. 测试数据库连接

### 3. 验证设置

脚本成功执行后，您应该看到类似以下的输出:

```
🎉 数据库初始化完成！

请确保你的 .env 文件包含以下配置:

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=apc_db
DB_USER=apc_user
DB_PASSWORD=your_secure_password
```

## 手动数据库设置（备选方案）

如果您更喜欢手动设置数据库，可以按照以下步骤操作:

### 1. 连接到 MySQL

```bash
mysql -u root -p
```

### 2. 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS apc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 3. 创建用户并授予权限

```sql
-- 创建本地用户
CREATE USER 'apc_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 创建远程用户（可选）
CREATE USER 'apc_user'@'%' IDENTIFIED BY 'your_secure_password';

-- 授予权限
GRANT ALL PRIVILEGES ON apc_db.* TO 'apc_user'@'localhost';
GRANT ALL PRIVILEGES ON apc_db.* TO 'apc_user'@'%';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 4. 验证设置

```sql
-- 测试连接
USE apc_db;
SELECT DATABASE() as current_database;
```

## 故障排除

### 1. 连接被拒绝

- 确保 MySQL 服务正在运行
- 检查主机名和端口是否正确
- 检查防火墙设置

### 2. 访问被拒绝

- 确保提供的用户名和密码正确
- 确保用户具有足够的权限创建数据库和用户

### 3. 用户已存在错误

- 脚本会自动处理已存在的用户，如果遇到问题可以手动删除现有用户:
  ```sql
  DROP USER 'apc_user'@'localhost';
  DROP USER 'apc_user'@'%';
  ```

## 安全建议

1. 使用强密码并定期更换
2. 限制用户权限，仅授予必要的权限
3. 不要在代码中硬编码密码
4. 使用环境变量或配置文件管理敏感信息
5. 在生产环境中，避免使用 root 用户进行应用连接