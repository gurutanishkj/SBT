import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to generate SBT booking codes like "SBT-8F42K9"
function generateBookingCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = 'SBT-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper to generate Transaction ID like "TXN-984210"
function generateTransactionId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `TXN-${num}`;
}

// POST /api/bookings - Create new booking with transactional concurrency check
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User must be authenticated' });
    }

    const {
      showId,
      seatIds, // Array of string seat IDs
      foodItems, // Array of { foodItemId: string, quantity: number }
      paymentMethod = 'UPI',
      convenienceFee = 35.40,
    } = req.body;

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one seat' });
    }

    // Execute atomic transaction to prevent race conditions / double bookings
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch Show and Screen details
      const show = await tx.show.findUnique({
        where: { id: showId },
        include: {
          screen: true,
          movie: true,
        },
      });

      if (!show || !show.active) {
        throw new Error('This showtime is no longer active');
      }

      // 2. Fetch seats and verify they belong to this screen
      const seats = await tx.seat.findMany({
        where: {
          id: { in: seatIds },
          screenId: show.screenId,
          active: true,
        },
      });

      if (seats.length !== seatIds.length) {
        throw new Error('One or more selected seats are invalid for this screen');
      }

      // 3. Double-check whether ANY of these seats are already booked for this show
      const alreadyBooked = await tx.bookingSeat.findMany({
        where: {
          showId: show.id,
          seatId: { in: seatIds },
        },
      });

      if (alreadyBooked.length > 0) {
        const bookedCodes = alreadyBooked.map((b) => b.seatCode).join(', ');
        throw new Error(`Seat(s) ${bookedCodes} were just booked by another patron. Please select different seats.`);
      }

      // 4. Calculate ticket price based on seat tiers
      let ticketTotal = 0;
      const seatBookingsData = [];

      for (const seat of seats) {
        let seatPrice = show.priceClassic;
        if (seat.tier === 'PREMIUM') seatPrice = show.pricePremium;
        if (seat.tier === 'RECLINER') seatPrice = show.priceRecliner;

        ticketTotal += seatPrice;
        seatBookingsData.push({
          seatId: seat.id,
          showId: show.id,
          seatCode: seat.seatCode,
          price: seatPrice,
        });
      }

      // 5. Calculate Food & Drinks total if any
      let foodTotal = 0;
      const validFoodOrders = [];

      if (Array.isArray(foodItems) && foodItems.length > 0) {
        for (const item of foodItems) {
          if (item.quantity > 0) {
            const foodRecord = await tx.foodItem.findUnique({
              where: { id: item.foodItemId },
            });
            if (foodRecord && foodRecord.active) {
              const itemCost = foodRecord.price * item.quantity;
              foodTotal += itemCost;
              validFoodOrders.push({
                foodItemId: foodRecord.id,
                quantity: item.quantity,
                unitPrice: foodRecord.price,
              });
            }
          }
        }
      }

      const totalAmount = ticketTotal + Number(convenienceFee) + foodTotal;
      const bookingCode = generateBookingCode();
      const transactionId = generateTransactionId();

      // 6. Create Booking
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          userId,
          showId: show.id,
          totalAmount,
          convenienceFee: Number(convenienceFee),
          foodAmount: foodTotal,
          status: 'CONFIRMED',
          bookingSeats: {
            create: seatBookingsData.map((sb) => ({
              seatId: sb.seatId,
              showId: sb.showId,
              seatCode: sb.seatCode,
              price: sb.price,
            })),
          },
          foodOrders: {
            create: validFoodOrders,
          },
          payment: {
            create: {
              transactionId,
              method: paymentMethod,
              amount: totalAmount,
              status: 'SUCCESS',
            },
          },
        },
        include: {
          bookingSeats: true,
          foodOrders: {
            include: {
              foodItem: true,
            },
          },
          payment: true,
          show: {
            include: {
              movie: true,
              screen: {
                include: {
                  theatre: true,
                },
              },
            },
          },
        },
      });

      // 7. Create in-app Notification for the user
      await tx.notification.create({
        data: {
          userId,
          title: 'Booking Confirmed!',
          message: `Your booking ${booking.bookingCode} for ${show.movie.title} on ${show.date} at ${show.startTime} is confirmed. Enjoy the show!`,
        },
      });

      return booking;
    });

    res.status(201).json({
      success: true,
      booking: result,
      message: 'Tickets booked successfully!',
    });
  } catch (err: any) {
    console.error('Booking failed:', err.message);
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to complete booking. Please try again.',
    });
  }
});

// GET /api/bookings/user - Fetch logged-in user's booking history
router.get('/user', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        bookingSeats: true,
        foodOrders: {
          include: {
            foodItem: true,
          },
        },
        payment: true,
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                theatre: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch user bookings' });
  }
});

// GET /api/bookings/:id - Fetch single booking by ID or Code
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id }, { bookingCode: id }],
      },
      include: {
        bookingSeats: true,
        foodOrders: {
          include: {
            foodItem: true,
          },
        },
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                theatre: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch booking details' });
  }
});

export default router;
