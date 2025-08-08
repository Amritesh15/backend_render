// src/routes/blogs/update.ts
import { Router } from 'express';
import { supabaseAdmin } from '../../services/supabaseClient';
import { authMiddleware } from '../../middlewares/authMiddleware';
const router = Router();
router.patch('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title && !content) {
        res.status(400).json({ error: 'Nothing to update' });
        return;
    }
    try {
        const { data, error } = await supabaseAdmin
            .from('blogs')
            .update({ title, content })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json(data);
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
