import express, { Request, Response } from 'express';
import { supabaseAdmin } from '../../services/supabaseClient';

const router = express.Router();

router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('properties')
      .select('*');

    if (error) {
      res.status(500).json({ error: error.message });
    }
    if (data){
    const filtered = data.filter(
      (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
    );
     res.status(200).json(filtered);
  }
  else {
  console.error('Data is null');
}

    
  } catch (err: any) {
     res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

export default router;
