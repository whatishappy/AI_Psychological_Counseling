import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'express';
import { sequelize } from './db/sequelize';
import authRouter from './routes/auth';
import consultationRouter from './routes/consultations';
import plansRouter from './routes/plans';
import measurementsRouter from './routes/measurements';
import assessmentsRouter from './routes/assessments';
import adminRouter from './routes/admin';
import path from 'path';

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors());
app.use(json({ limit: '1mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '..')));

// 健康检查端点
app.get('/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API路由
app.use('/api/auth', authRouter);
app.use('/api/consultations', consultationRouter);
app.use('/api/plans', plansRouter);
app.use('/api/measurements', measurementsRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/admin', adminRouter);

// 全局错误处理中间件
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404处理 - 必须放在静态文件服务和API路由之后
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        // 测试数据库连接
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // 同步模型
        await sequelize.sync();
        console.log('Database models synchronized.');
        
        // 启动服务器
        const server = app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
        
        // 优雅关闭
        process.on('SIGINT', async () => {
            console.log('Shutting down gracefully...');
            await sequelize.close();
            server.close(() => {
                console.log('Process terminated.');
                process.exit(0);
            });
        });
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
}

// 只在直接运行此文件时启动服务器
if (require.main === module) {
    start();
}

export default app;