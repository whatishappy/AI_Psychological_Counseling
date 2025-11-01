import { Router } from 'express';
import { requireRegistered } from '../middleware/auth';
import { ExercisePlan } from '../models/index';

const router = Router();

router.get('/', requireRegistered, async (req, res) => {
    const items = await ExercisePlan.findAll({ where: { user_id: req.auth!.userId! }, order: [['created_at', 'DESC']] });
    res.json(items);
});

router.post('/', requireRegistered, async (req, res) => {
    const user_id = req.auth!.userId!;
    const plan = await ExercisePlan.create({ user_id, ...req.body });
    res.json(plan);
});

router.get('/:id', requireRegistered, async (req, res) => {
    const plan = await ExercisePlan.findOne({ where: { plan_id: Number(req.params.id), user_id: req.auth!.userId! } });
    if (!plan) return res.status(404).json({ error: 'Not found' });
    res.json(plan);
});

router.put('/:id', requireRegistered, async (req, res) => {
    const plan = await ExercisePlan.findOne({ where: { plan_id: Number(req.params.id), user_id: req.auth!.userId! } });
    if (!plan) return res.status(404).json({ error: 'Not found' });
    await plan.update(req.body);
    res.json(plan);
});

router.delete('/:id', requireRegistered, async (req, res) => {
    const plan = await ExercisePlan.findOne({ where: { plan_id: Number(req.params.id), user_id: req.auth!.userId! } });
    if (!plan) return res.status(404).json({ error: 'Not found' });
    await plan.destroy();
    res.json({ ok: true });
});

export default router;


