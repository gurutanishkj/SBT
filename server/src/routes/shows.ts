import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { formatISTDate, getUpcomingDates } from '../utils/dateUtils';
import ShowtimeSyncService from '../services/showtimeSyncService';

const router = Router();

// GET /api/shows/dates - Return 7 upcoming dynamic dates with full labels
router.get('/dates', (_req: Request, res: Response) => {
  const dates = getUpcomingDates(7);
  res.json({
    success: true,
    today: formatISTDate(),
    dates,
  });
});

// GET /api/shows
router.get('/', async (req: Request, res: Response) => {
  try {
    const { date, movieId } = req.query;
    const filterDate = (date as string) || formatISTDate();

    const whereClause: any = {
      active: true,
      date: filterDate,
      screen: {
        active: true,
        theatre: {
          active: true,
          city: 'Kovilpatti',
        },
      },
    };

    if (movieId) {
      whereClause.movieId = movieId;
    }

    const shows = await prisma.show.findMany({
      where: whereClause,
      include: {
        movie: true,
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
      let status: 'AVAILABLE' | 'FAST_FILLING' | 'SOLD_OUT' = 'AVAILABLE';
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
        bookedCount,
        totalSeats,
        movie: {
          id: show.movie.id,
          title: show.movie.title,
          language: show.movie.language,
          format: show.movie.format,
          certificate: show.movie.certificate,
          genre: show.movie.genre,
          duration: show.movie.duration,
          rating: show.movie.rating,
          posterUrl: show.movie.posterUrl,
        },
        screen: {
          id: show.screen.id,
          name: show.screen.name,
          soundSystem: show.screen.soundSystem,
          projectionType: show.screen.projectionType,
        },
        theatre: {
          id: show.screen.theatre.id,
          name: show.screen.theatre.name,
          address: show.screen.theatre.address,
          city: show.screen.theatre.city,
        },
      };
    });

    res.json({
      success: true,
      date: filterDate,
      totalShows: formattedShows.length,
      shows: formattedShows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch shows' });
  }
});

// GET /api/shows/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const show = await prisma.show.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
        bookingSeats: true,
      },
    });

    if (!show) {
      return res.status(404).json({ success: false, error: 'Show not found' });
    }

    const totalSeats = show.screen.totalSeats || 150;
    const bookedCount = show.bookingSeats.length;
    let status = 'AVAILABLE';
    if (bookedCount >= totalSeats) status = 'SOLD_OUT';
    else if (bookedCount / totalSeats >= 0.75) status = 'FAST_FILLING';

    res.json({
      success: true,
      show: {
        ...show,
        status,
        bookedCount,
        totalSeats,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch show details' });
  }
});

// GET /api/shows/:id/seats
router.get('/:id/seats', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const show = await prisma.show.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
            seats: {
              where: { active: true },
              orderBy: [
                { row: 'asc' },
                { number: 'asc' },
              ],
            },
          },
        },
        bookingSeats: true,
      },
    });

    if (!show) {
      return res.status(404).json({ success: false, error: 'Show not found' });
    }

    // Set of booked seat IDs for this show
    const bookedSeatIds = new Set(show.bookingSeats.map((bs) => bs.seatId));

    // Group seats by rows A to J
    const rowsMap: { [key: string]: any[] } = {};
    for (const seat of show.screen.seats) {
      if (!rowsMap[seat.row]) {
        rowsMap[seat.row] = [];
      }

      // Determine price based on tier and show configuration
      let price = show.priceClassic;
      if (seat.tier === 'PREMIUM') price = show.pricePremium;
      if (seat.tier === 'RECLINER') price = show.priceRecliner;

      rowsMap[seat.row].push({
        id: seat.id,
        row: seat.row,
        number: seat.number,
        seatCode: seat.seatCode,
        tier: seat.tier,
        price,
        isOccupied: bookedSeatIds.has(seat.id),
      });
    }

    res.json({
      success: true,
      show: {
        id: show.id,
        date: show.date,
        startTime: show.startTime,
        movie: {
          id: show.movie.id,
          title: show.movie.title,
          language: show.movie.language,
          format: show.movie.format,
          certificate: show.movie.certificate,
          genre: show.movie.genre,
          duration: show.movie.duration,
          posterUrl: show.movie.posterUrl,
        },
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
        pricing: {
          classic: show.priceClassic,
          premium: show.pricePremium,
          recliner: show.priceRecliner,
        },
      },
      rows: rowsMap,
      totalSeats: show.screen.seats.length,
      bookedCount: bookedSeatIds.size,
    });
  } catch (err: any) {
    console.error('Error fetching seats:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch seats for show' });
  }
});

export default router;
