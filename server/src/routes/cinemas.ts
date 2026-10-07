import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { formatISTDate } from '../utils/dateUtils';

const router = Router();

// GET /api/cinemas
router.get('/', async (_req: Request, res: Response) => {
  try {
    const theatres = await prisma.theatre.findMany({
      where: {
        active: true,
        city: 'Kovilpatti',
      },
      include: {
        screens: {
          where: { active: true },
        },
      },
    });

    res.json({
      success: true,
      city: 'Kovilpatti',
      cinemas: theatres,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch cinemas' });
  }
});

// GET /api/cinemas/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const theatre = await prisma.theatre.findUnique({
      where: { id },
      include: {
        screens: {
          where: { active: true },
        },
      },
    });

    if (!theatre) {
      return res.status(404).json({ success: false, error: 'Cinema not found' });
    }

    res.json({ success: true, cinema: theatre });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch cinema' });
  }
});

// GET /api/cinemas/:id/movies
router.get('/:id/movies', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const today = formatISTDate();

    const shows = await prisma.show.findMany({
      where: {
        active: true,
        date: { gte: today },
        screen: {
          theatreId: id,
          active: true,
        },
      },
      include: {
        movie: true,
        screen: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const moviesMap = new Map();
    for (const show of shows) {
      if (!moviesMap.has(show.movie.id)) {
        moviesMap.set(show.movie.id, {
          ...show.movie,
          shows: [],
        });
      }
      moviesMap.get(show.movie.id).shows.push({
        id: show.id,
        date: show.date,
        startTime: show.startTime,
        screen: show.screen.name,
        priceClassic: show.priceClassic,
        pricePremium: show.pricePremium,
        priceRecliner: show.priceRecliner,
      });
    }

    res.json({
      success: true,
      movies: Array.from(moviesMap.values()),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch movies for cinema' });
  }
});

export default router;
