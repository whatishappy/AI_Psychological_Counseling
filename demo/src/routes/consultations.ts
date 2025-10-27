import { Router } from 'express';
import { body } from 'express-validator';
import { optionalAuth, requireRegistered } from '../middleware/auth';
import { ConsultationSession, ExercisePlan, User } from '../models/index';
import { generatePsychologicalAdvice, generateExercisePlanStub } from '../services/ai';

const router = Router();

// Create a consultation session (guest or registered)
router.post(
    '/',
    optionalAuth,
    body('user_query').isLength({ min: 1 }).withMessage('User query is required'),
    async (req, res) => {
        try {
            const { user_query, consultation_type, mood_rating, base_profile } = req.body as any;
            
            // 验证请求参数
            if (!user_query || typeof user_query !== 'string') {
                return res.status(400).json({ error: 'Invalid user query' });
            }
            
            // 生成AI响应
            const ai_response = await generatePsychologicalAdvice(user_query);
            
            // 处理用户ID（游客为null，注册用户为实际ID）
            const userId = req.auth?.userId || null;
            
            // 创建会话记录
            const session = await ConsultationSession.create({
                user_id: userId,
                user_query,
                ai_response,
                consultation_type: consultation_type || 'psychological',
                mood_rating: mood_rating || null,
                session_duration: 0
            } as any);

            let planPreview: any = null;
            if (!req.auth || req.auth.userType === 'guest') {
                // generate a preview plan but do not persist until user registers
                planPreview = generateExercisePlanStub(base_profile || {});
            }

            res.status(201).json({ session, ai_response, plan_preview: planPreview });
        } catch (error: any) {
            console.error('Error creating consultation session:', error);
            res.status(500).json({ 
                error: 'Failed to create consultation session',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// Registered user can attach/create an exercise plan based on a session
router.post('/:sessionId/plan', requireRegistered, async (req, res) => {
    try {
        const sessionId = Number(req.params.sessionId);
        const userId = req.auth!.userId!;
        
        if (isNaN(sessionId)) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        const { plan_name, plan_description, plan_content, duration_weeks, intensity_level, target_areas, calories_target, start_date, end_date } = req.body;

        // ensure session belongs to user or is created by them (user_id=0 guest shouldn't be attachable)
        const session = await ConsultationSession.findOne({ where: { session_id: sessionId } });
        if (!session) return res.status(404).json({ error: 'Session not found' });
        
        // 检查会话是否属于当前用户（允许null，即游客创建的会话）
        if (session.user_id !== null && session.user_id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const plan = await ExercisePlan.create({
            user_id: userId,
            session_id: sessionId,
            plan_name: plan_name || '默认计划',
            plan_description: plan_description || '',
            plan_content: plan_content || {},
            duration_weeks: duration_weeks || 4,
            intensity_level: intensity_level || 'medium',
            target_areas: target_areas || [],
            calories_target: calories_target || 0,
            start_date,
            end_date
        });
        res.status(201).json({ plan });
    } catch (error: any) {
        console.error('Error creating exercise plan:', error);
        res.status(500).json({ 
            error: 'Failed to create exercise plan',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// List consultations for current user
router.get('/', optionalAuth, async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            // 游客用户返回空数组
            return res.json([]);
        }
        
        const items = await ConsultationSession.findAll({ 
            where: { user_id: req.auth.userId }, 
            order: [['created_at', 'DESC']],
            attributes: { exclude: ['user_id'] } // 不返回user_id字段
        });
        res.json(items);
    } catch (error: any) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({ 
            error: 'Failed to fetch consultations',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

export default router;


