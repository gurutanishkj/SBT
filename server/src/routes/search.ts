import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { formatISTDate } from '../utils/dateUtils';

const router = Router();

// GET /api/search?q=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = ((req.query.q as string) || '').trim();

    if (!query) {
      return res.json({
        success: true,
        movies: [],
        cinemas: [],
        showtimes: [],
      });
    }

    const today = formatISTDate();

    // 1. Search Movies (matching title, genre, language, cast)
    const movies = await prisma.movie.findMany({
      where: {
        active: true,
        OR: [
          { title: { contains: query } },
          { genre: { contains: query } },
          { language: { contains: query } },
          { cast: { contains: query } },
          { director: { contains: query } },
        ],
        NOT: {
          title: { contains: 'kalki' },
        },
      },
    });

    // 2. Search Cinemas (matching name, city, address)
    const cinemas = await prisma.theatre.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: query } },
          { city: { contains: query } },
          { address: { contains: query } },
        ],
      },
      include: {
        screens: true,
      },
    });

    // 3. Search Showtimes by matching movie title or screen
    const showtimes = await prisma.show.findMany({
      where: {
        active: true,
        date: { gte: today },
        OR: [
          { movie: { title: { contains: query } } },
          { startTime: { contains: query } },
        ],
        NOT: {
          movie: {
            title: { contains: 'kalki' },
          },
        },
      },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
      },
      take: 10,
    });

    res.json({
      success: true,
      query,
      results: {
        movies,
        cinemas,
        showtimes: showtimes.map((s) => ({
          id: s.id,
          movieTitle: s.movie.title,
          movieId: s.movie.id,
          startTime: s.startTime,
          date: s.date,
          screenName: s.screen.name,
          cinemaName: s.screen.theatre.name,
          priceClassic: s.priceClassic,
        })),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Search query failed' });
  }
});

export default router;
