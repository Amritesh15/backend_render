// src/routes/blogs/delete.ts
import { Router } from 'express';
import { supabaseAdmin } from '../../services/supabaseClient';
import { authMiddleware } from '../../middlewares/authMiddleware';
const router = Router();
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabaseAdmin.from('blogs').delete().eq('id', id);
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(204).send(); // No Content
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
