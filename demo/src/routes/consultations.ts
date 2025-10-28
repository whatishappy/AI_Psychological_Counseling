import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { ConsultationSession, ConsultationMessage } from '../models';
import { generatePsychologicalAdvice } from '../services/ai';

const router = Router();

interface ConsultationRequestBody {
    user_query: string;
    consultation_type?: 'psychological' | 'sports_advice' | 'comprehensive';
    mood_rating?: number;
    base_profile?: any;
}

// 创建咨询消息接口
router.post('/', requireAuth, async (req: Request<{}, {}, ConsultationRequestBody>, res: Response) => {
    try {
        const { user_query, consultation_type, mood_rating, base_profile } = req.body;
        
        // 验证请求参数
        if (!user_query || typeof user_query !== 'string') {
            return res.status(400).json({ error: 'Invalid user query' });
        }
        
        // 生成AI响应
        const ai_response = await generatePsychologicalAdvice(user_query);
        
        // 处理用户ID（游客为null，注册用户为实际ID）
        const userId = req.auth?.userId || null;
        
        // 创建或获取会话
        const [session] = await ConsultationSession.findOrCreate({
            where: { 
                user_id: userId
            },
            defaults: { 
                user_id: userId, 
                consultation_type: consultation_type || 'psychological'
            }
        });
        
        res.json({
            session_id: session.getDataValue('session_id'),
            ai_response: ai_response
        });
    } catch (error) {
        console.error('Consultation error:', error);
        res.status(500).json({ error: 'Failed to process consultation' });
    }
});

export default router;