import express from 'express';
import { supabaseAdmin } from '../../services/supabaseClient';
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('properties')
            .select('*');
        if (error) {
            res.status(500).json({ error: error.message });
        }
        const filtered = data.filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number');
        res.status(200).json(filtered);
    }
    catch (err) {
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
});
export default router;
