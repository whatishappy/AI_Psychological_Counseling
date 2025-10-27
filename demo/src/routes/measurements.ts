import { Router } from 'express';
import { requireRegistered } from '../middleware/auth';
import { BodyMeasurement } from '../models/index';

const router = Router();

router.get('/', requireRegistered, async (req, res) => {
    const data = await BodyMeasurement.findAll({ where: { user_id: req.auth!.userId! }, order: [['measurement_date', 'ASC']] });
    res.json(data);
});

router.post('/', requireRegistered, async (req, res) => {
    const user_id = req.auth!.userId!;
    const payload = { ...req.body, user_id };
    const created = await BodyMeasurement.create(payload);
    res.json(created);
});

router.put('/:id', requireRegistered, async (req, res) => {
    const item = await BodyMeasurement.findOne({ where: { measurement_id: Number(req.params.id), user_id: req.auth!.userId! } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update(req.body);
    res.json(item);
});

router.delete('/:id', requireRegistered, async (req, res) => {
    const item = await BodyMeasurement.findOne({ where: { measurement_id: Number(req.params.id), user_id: req.auth!.userId! } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.json({ ok: true });
});

export default router;


