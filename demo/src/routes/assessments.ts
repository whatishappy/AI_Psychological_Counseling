import { Router } from 'express';
import { requireRegistered } from '../middleware/auth';
import { PsychologicalAssessment, PhysicalAssessment } from '../models/index';
import { assessWeeklyPsych, assessWeeklyPhysical } from '../services/ai';

const router = Router();

// Psych weekly
router.get('/psych', requireRegistered, async (req, res) => {
    const items = await PsychologicalAssessment.findAll({ where: { user_id: req.auth!.userId! }, order: [['assessment_date', 'DESC']] });
    res.json(items);
});

router.post('/psych', requireRegistered, async (req, res) => {
    const user_id = req.auth!.userId!;
    const { assessment_date, stress_level, anxiety_level, sleep_quality, social_support } = req.body;
    const { overall, recommendations } = assessWeeklyPsych({ stress: stress_level, anxiety: anxiety_level, sleep: sleep_quality, support: social_support });
    const created = await PsychologicalAssessment.create({
        user_id,
        assessment_date,
        overall_score: overall,
        stress_level,
        anxiety_level,
        sleep_quality,
        social_support,
        assessment_details: req.body,
        recommendations
    });
    res.json(created);
});

// Physical weekly
router.get('/physical', requireRegistered, async (req, res) => {
    const items = await PhysicalAssessment.findAll({ where: { user_id: req.auth!.userId! }, order: [['assessment_date', 'DESC']] });
    res.json(items);
});

router.post('/physical', requireRegistered, async (req, res) => {
    const user_id = req.auth!.userId!;
    const { assessment_date, cardiovascular_level, strength_level, flexibility_level, endurance_level } = req.body;
    const { overall, recommendations } = assessWeeklyPhysical({ cardio: cardiovascular_level, strength: strength_level, flexibility: flexibility_level, endurance: endurance_level });
    const created = await PhysicalAssessment.create({
        user_id,
        assessment_date,
        overall_score: overall,
        cardiovascular_level,
        strength_level,
        flexibility_level,
        endurance_level,
        assessment_details: req.body,
        recommendations
    });
    res.json(created);
});

export default router;


