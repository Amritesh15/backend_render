// src/routes/newsletters/index.ts
import { Router } from 'express';
import { supabaseAdmin } from '../../services/supabaseClient';
import { authMiddleware } from '../../middlewares/authMiddleware';
const router = Router();
/**
 * GET /api/newsletters
 * Fetches all newsletters, ordered by created_at DESC.
 */
router.get('/', authMiddleware, async (_req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('newsletters')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
