import { Router, Response } from 'express';
import prisma from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/favorites
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        movie: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      favorites: favorites.map((f) => f.movie),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
  }
});

// POST /api/favorites
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, error: 'movieId is required' });
    }

    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        movieId,
      },
    });

    if (existing) {
      return res.json({ success: true, message: 'Already in favorites', favorite: existing });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: userId!,
        movieId,
      },
      include: {
        movie: true,
      },
    });

    res.status(201).json({ success: true, message: 'Added to favorites', favorite });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to add favorite' });
  }
});

// DELETE /api/favorites/:movieId
router.delete('/:movieId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { movieId } = req.params;

    await prisma.favorite.deleteMany({
      where: {
        userId,
        movieId,
      },
    });

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to remove favorite' });
  }
});

export default router;
