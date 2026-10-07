import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/offers - List all promo offers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const offers = await prisma.offer.findMany({
      where: { active: true },
    });
    res.json({ success: true, offers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch offers' });
  }
});

export default router;
