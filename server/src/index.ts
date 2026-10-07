import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';
import cinemaRoutes from './routes/cinemas';
import showRoutes from './routes/shows';
import bookingRoutes from './routes/bookings';
import paymentRoutes from './routes/payments';
import favoriteRoutes from './routes/favorites';
import foodRoutes from './routes/food';
import offerRoutes from './routes/offers';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';
import { formatISTDate } from './utils/dateUtils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Health and Real-Time IST Server Info Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    brand: 'SBT CINEMAS',
    multiplex: 'SATHYABAMA MULTIPLEX',
    location: 'Kovilpatti',
    address: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
    timezone: 'Asia/Kolkata',
    currentDate: formatISTDate(),
    timestamp: new Date().toISOString(),
  });
});

// Fallback 404
app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🎬 SBT CINEMAS API Server running on port ${PORT}`);
  console.log(`📍 Location: Kovilpatti | Timezone: Asia/Kolkata | Date: ${formatISTDate()}`);
});
