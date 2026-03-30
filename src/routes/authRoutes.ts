import { Router } from 'express';

const router = Router();

router.get('/google/config', (req, res) => {
  res.json({ client_id: process.env.GOOGLE_CLIENT_ID });
});

export default router;