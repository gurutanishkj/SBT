import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// POST /api/payments - Demo Payment Gateway simulation
router.post('/', async (req: Request, res: Response) => {
  try {
    const { bookingId, method = 'UPI', amount } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, error: 'bookingId is required' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    if (booking.payment) {
      const updatedPayment = await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          transactionId,
          method,
          amount: amount || booking.totalAmount,
          status: 'SUCCESS',
        },
      });

      return res.json({
        success: true,
        message: 'Payment processed successfully',
        payment: updatedPayment,
      });
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        transactionId,
        method,
        amount: amount || booking.totalAmount,
        status: 'SUCCESS',
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' },
    });

    res.json({
      success: true,
      message: 'Payment completed successfully',
      payment,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Payment processing error' });
  }
});

export default router;
