import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/food - List all gourmet food items
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.foodItem.findMany({
      where: { active: true },
    });
    res.json({ success: true, items });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch food items' });
  }
});

export default router;
