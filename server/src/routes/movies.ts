import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { formatISTDate, getUpcomingDates } from '../utils/dateUtils';
import ShowtimeSyncService from '../services/showtimeSyncService';

const router = Router();

// GET /api/movies/now-showing
router.get('/now-showing', async (_req: Request, res: Response) => {
  try {
    const today = formatISTDate();

    // Query shows that are active, date >= today, belonging to Kovilpatti and active theatre/screen
    const activeShows = await prisma.show.findMany({
      where: {
        active: true,
        date: { gte: today },
        movie: {
          active: true,
          // Extra guard to guarantee no prohibited title
          NOT: {
            title: {
              contains: 'kalki',
            },
          },
        },
        screen: {
          active: true,
          theatre: {
            active: true,
            city: 'Kovilpatti',
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
        bookingSeats: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    // Group shows by movie
    const movieMap = new Map<string, any>();

    for (const show of activeShows) {
      const movie = show.movie;
      if (!movieMap.has(movie.id)) {
        movieMap.set(movie.id, {
          ...movie,
          cinemaName: show.screen.theatre.name,
          cinemaAddress: show.screen.theatre.address,
          cinemaCity: show.screen.theatre.city,
          showtimes: [],
          shows: [],
        });
      }

      const movieEntry = movieMap.get(movie.id);
      
      const totalSeats = show.screen.totalSeats || 150;
      const bookedCount = show.bookingSeats.length;
      let status: 'AVAILABLE' | 'FAST_FILLING' | 'SOLD_OUT' = 'AVAILABLE';
      if (bookedCount >= totalSeats) {
        status = 'SOLD_OUT';
      } else if (bookedCount / totalSeats >= 0.75) {
        status = 'FAST_FILLING';
      }

      const showItem = {
        id: show.id,
        date: show.date,
        startTime: show.startTime,
        screenName: show.screen.name,
        screenId: show.screen.id,
        priceClassic: show.priceClassic,
        pricePremium: show.pricePremium,
        priceRecliner: show.priceRecliner,
        status,
        bookedCount,
        totalSeats,
      };

      movieEntry.shows.push(showItem);
      if (!movieEntry.showtimes.includes(show.startTime)) {
        movieEntry.showtimes.push(show.startTime);
      }
    }

    const moviesList = Array.from(movieMap.values()).map((m) => {
      // Find earliest showtime for today or nearest date
      const todayShows = m.shows.filter((s: any) => s.date === today);
      const earliestShow = todayShows.length > 0 ? todayShows[0].startTime : (m.shows[0]?.startTime || '10:30 AM');
      return {
        ...m,
        earliestShowtime: earliestShow,
        availableShowtimesList: m.showtimes,
      };
    });

    res.json({
      success: true,
      currentDate: today,
      city: 'Kovilpatti',
      cinema: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
      totalMovies: moviesList.length,
      movies: moviesList,
    });
  } catch (err: any) {
    console.error('Error in /api/movies/now-showing:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch now-showing movies' });
  }
});

// GET /api/movies/upcoming
router.get('/upcoming', async (_req: Request, res: Response) => {
  try {
    const today = formatISTDate();
    const upcomingMovies = await prisma.movie.findMany({
      where: {
        active: true,
        OR: [
          { status: 'COMING_SOON' },
          { releaseDate: { gt: today } },
        ],
        NOT: {
          title: {
            contains: 'kalki',
          },
        },
      },
      orderBy: {
        releaseDate: 'asc',
      },
    });

    res.json({
      success: true,
      currentDate: today,
      movies: upcomingMovies,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch upcoming movies' });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        shows: {
          where: {
            active: true,
            date: { gte: formatISTDate() },
          },
          include: {
            screen: {
              include: {
                theatre: true,
              },
            },
            bookingSeats: true,
          },
          orderBy: [
            { date: 'asc' },
            { startTime: 'asc' },
          ],
        },
      },
    });

    if (!movie || movie.title.toLowerCase().includes('kalki')) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }

    // Enhance shows with status
    const enhancedShows = movie.shows.map((show) => {
      const totalSeats = show.screen.totalSeats || 150;
      const bookedCount = show.bookingSeats.length;
      let status = 'AVAILABLE';
      if (bookedCount >= totalSeats) status = 'SOLD_OUT';
      else if (bookedCount / totalSeats >= 0.75) status = 'FAST_FILLING';

      return {
        id: show.id,
        date: show.date,
        startTime: show.startTime,
        priceClassic: show.priceClassic,
        pricePremium: show.pricePremium,
        priceRecliner: show.priceRecliner,
        status,
        screen: {
          id: show.screen.id,
          name: show.screen.name,
          soundSystem: show.screen.soundSystem,
          projectionType: show.screen.projectionType,
        },
        theatre: {
          id: show.screen.theatre.id,
          name: show.screen.theatre.name,
          city: show.screen.theatre.city,
          address: show.screen.theatre.address,
          facilities: show.screen.theatre.facilities,
        },
      };
    });

    res.json({
      success: true,
      movie: {
        ...movie,
        shows: enhancedShows,
        hasActiveShows: enhancedShows.length > 0,
        cinema: {
          name: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
          city: 'Kovilpatti',
          address: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch movie details' });
  }
});

// GET /api/movies/:id/shows
router.get('/:id/shows', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestedDate = (req.query.date as string) || formatISTDate();

    const shows = await prisma.show.findMany({
      where: {
        movieId: id,
        date: requestedDate,
        active: true,
        screen: {
          active: true,
          theatre: {
            active: true,
            city: 'Kovilpatti',
          },
        },
      },
      include: {
        screen: {
          include: {
            theatre: true,
          },
        },
        bookingSeats: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const formattedShows = shows.map((show) => {
      const totalSeats = show.screen.totalSeats || 150;
      const bookedCount = show.bookingSeats.length;
      let status = 'AVAILABLE';
      if (bookedCount >= totalSeats) status = 'SOLD_OUT';
      else if (bookedCount / totalSeats >= 0.75) status = 'FAST_FILLING';

      return {
        id: show.id,
        date: show.date,
        startTime: show.startTime,
        priceClassic: show.priceClassic,
        pricePremium: show.pricePremium,
        priceRecliner: show.priceRecliner,
        status,
        screen: {
          id: show.screen.id,
          name: show.screen.name,
          soundSystem: show.screen.soundSystem,
        },
        theatre: {
          name: show.screen.theatre.name,
          address: show.screen.theatre.address,
          city: show.screen.theatre.city,
        },
      };
    });

    res.json({
      success: true,
      date: requestedDate,
      totalShows: formattedShows.length,
      shows: formattedShows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch shows for movie' });
  }
});

// GET /api/movies/:id/cinemas
router.get('/:id/cinemas', async (_req: Request, res: Response) => {
  try {
    const theatres = await prisma.theatre.findMany({
      where: {
        active: true,
        city: 'Kovilpatti',
      },
      include: {
        screens: true,
      },
    });

    res.json({ success: true, theatres });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch cinemas' });
  }
});

export default router;
