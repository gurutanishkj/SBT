import {
  INITIAL_MOVIES,
  THEATRE_KOVILPATTI,
  FOOD_ITEMS,
  OFFERS,
  getFallbackDates,
  generateFallbackSeats,
} from './fallbackStore';

const API_BASE = '/api';

// Detect if we are on a static environment like GitHub Pages
const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || window.location.protocol === 'file:');

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('sbt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (isStaticHost) {
    throw new Error('Static host - fallback to local store');
  }

  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.includes('application/json')) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// In-browser dynamic database simulator for GitHub Pages deployment
function getStoredMovies() {
  const stored = localStorage.getItem('sbt_custom_movies');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return [...INITIAL_MOVIES, ...parsed];
    } catch {
      return INITIAL_MOVIES;
    }
  }
  return INITIAL_MOVIES;
}

function getStoredCustomShows() {
  const stored = localStorage.getItem('sbt_custom_shows');
  return stored ? JSON.parse(stored) : [];
}

export const api = {
  // Auth
  register: async (body: any) => {
    try {
      return await fetchApi<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) });
    } catch {
      const user = { id: 'usr-' + Date.now(), name: body.name, email: body.email, phone: body.phone, role: 'USER' };
      localStorage.setItem('sbt_user', JSON.stringify(user));
      localStorage.setItem('sbt_token', 'demo-token-' + Date.now());
      return { success: true, token: 'demo-token', user };
    }
  },

  login: async (body: any) => {
    try {
      return await fetchApi<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) });
    } catch {
      const isAdmin = body.email.toLowerCase().includes('admin');
      const user = {
        id: isAdmin ? 'admin-1' : 'user-1',
        name: isAdmin ? 'SBT Kovilpatti Admin' : 'Karthik Raja',
        email: body.email,
        phone: '9842109876',
        role: isAdmin ? 'ADMIN' : 'USER',
      };
      localStorage.setItem('sbt_user', JSON.stringify(user));
      localStorage.setItem('sbt_token', 'demo-jwt-token');
      return { success: true, token: 'demo-jwt-token', user };
    }
  },

  getMe: async () => {
    try {
      return await fetchApi<any>('/auth/me');
    } catch {
      const stored = localStorage.getItem('sbt_user');
      if (stored) {
        return { success: true, user: JSON.parse(stored) };
      }
      return {
        success: true,
        user: { id: 'demo-user', name: 'Karthik Raja', email: 'guest@sbtcinemas.com', phone: '9842109876', role: 'USER' },
      };
    }
  },

  logout: async () => {
    try {
      await fetchApi<any>('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('sbt_user');
    localStorage.removeItem('sbt_token');
    return { success: true };
  },

  forgotPassword: async (email: string) => {
    try {
      return await fetchApi<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    } catch {
      return { success: true, message: `Password reset instructions dispatched to ${email}.` };
    }
  },

  // Movies
  getNowShowing: async () => {
    try {
      return await fetchApi<any>('/movies/now-showing');
    } catch {
      const all = getStoredMovies();
      const customShows = getStoredCustomShows();
      const activeCustomMovieIds = new Set(customShows.map((s: any) => s.movieId));

      const nowShowing = all.filter((m) => m.status === 'NOW_SHOWING' || activeCustomMovieIds.has(m.id));
      return {
        success: true,
        city: 'Kovilpatti',
        cinema: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
        currentDate: new Date().toISOString().split('T')[0],
        totalMovies: nowShowing.length,
        movies: nowShowing,
      };
    }
  },

  getUpcoming: async () => {
    try {
      return await fetchApi<any>('/movies/upcoming');
    } catch {
      const all = getStoredMovies();
      const customShows = getStoredCustomShows();
      const activeCustomMovieIds = new Set(customShows.map((s: any) => s.movieId));

      const upcoming = all.filter((m) => m.status === 'COMING_SOON' && !activeCustomMovieIds.has(m.id));
      return { success: true, movies: upcoming };
    }
  },

  getMovieDetails: async (id: string) => {
    try {
      return await fetchApi<any>(`/movies/${id}`);
    } catch {
      const all = getStoredMovies();
      const movie = all.find((m) => m.id === id) || all[0];
      return {
        success: true,
        movie: {
          ...movie,
          cinema: THEATRE_KOVILPATTI,
          hasActiveShows: movie.status === 'NOW_SHOWING',
        },
      };
    }
  },

  getMovieShows: async (id: string, date?: string) => {
    try {
      return await fetchApi<any>(`/movies/${id}/shows${date ? `?date=${date}` : ''}`);
    } catch {
      const all = getStoredMovies();
      const movie = all.find((m) => m.id === id) || all[0];
      const customShows = getStoredCustomShows().filter((s: any) => s.movieId === id && (!date || s.date === date));

      const times = movie.availableShowtimesList || ['10:30 AM', '02:20 PM', '06:20 PM', '10:15 PM'];
      const defaultShows = times.map((t: string, idx: number) => ({
        id: `show-${id}-${idx}`,
        date: date || new Date().toISOString().split('T')[0],
        startTime: t,
        priceClassic: 150,
        pricePremium: 190,
        priceRecliner: 250,
        status: idx === 1 ? 'FAST_FILLING' : 'AVAILABLE',
        screen: idx % 2 === 0 ? THEATRE_KOVILPATTI.screens![0] : THEATRE_KOVILPATTI.screens![1],
        theatre: THEATRE_KOVILPATTI,
      }));

      return {
        success: true,
        date: date || new Date().toISOString().split('T')[0],
        shows: [...customShows, ...defaultShows],
      };
    }
  },

  // Shows & Dates
  getDates: async () => {
    try {
      return await fetchApi<any>('/shows/dates');
    } catch {
      return {
        success: true,
        today: new Date().toISOString().split('T')[0],
        dates: getFallbackDates(),
      };
    }
  },

  getShows: async (date?: string, movieId?: string) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (movieId) params.append('movieId', movieId);
      return await fetchApi<any>(`/shows?${params.toString()}`);
    } catch {
      const allMovies = getStoredMovies().filter((m) => m.status === 'NOW_SHOWING');
      const targetDate = date || new Date().toISOString().split('T')[0];
      const allShows: any[] = [];

      for (const m of allMovies) {
        const times = m.availableShowtimesList || ['10:30 AM', '02:20 PM', '06:20 PM', '10:15 PM'];
        times.forEach((time: string, idx: number) => {
          allShows.push({
            id: `show-${m.id}-${idx}`,
            date: targetDate,
            startTime: time,
            priceClassic: 150,
            pricePremium: 190,
            priceRecliner: 250,
            status: idx === 1 ? 'FAST_FILLING' : 'AVAILABLE',
            movie: m,
            screen: idx % 2 === 0 ? THEATRE_KOVILPATTI.screens![0] : THEATRE_KOVILPATTI.screens![1],
            theatre: THEATRE_KOVILPATTI,
          });
        });
      }

      return {
        success: true,
        date: targetDate,
        totalShows: allShows.length,
        shows: allShows,
      };
    }
  },

  getShowSeats: async (showId: string) => {
    try {
      return await fetchApi<any>(`/shows/${showId}/seats`);
    } catch {
      const all = getStoredMovies();
      // Match movie by showId pattern or default to first movie
      const foundMovie = all.find((m) => showId.includes(m.id)) || all[0];
      const rows = generateFallbackSeats('Screen 1 - 4K Dolby Atmos', showId);

      return {
        success: true,
        show: {
          id: showId,
          date: new Date().toISOString().split('T')[0],
          startTime: '02:20 PM',
          movie: foundMovie,
          screen: THEATRE_KOVILPATTI.screens![0],
          theatre: THEATRE_KOVILPATTI,
          pricing: { classic: 150, premium: 190, recliner: 250 },
        },
        rows,
        totalSeats: 150,
      };
    }
  },

  // Cinemas
  getCinemas: async () => {
    try {
      return await fetchApi<any>('/cinemas');
    } catch {
      return { success: true, city: 'Kovilpatti', cinemas: [THEATRE_KOVILPATTI] };
    }
  },

  getCinemaDetails: async (_id: string) => {
    try {
      return await fetchApi<any>(`/cinemas/${_id}`);
    } catch {
      return { success: true, cinema: THEATRE_KOVILPATTI };
    }
  },

  // Bookings & Payments
  createBooking: async (body: any) => {
    try {
      return await fetchApi<any>('/bookings', { method: 'POST', body: JSON.stringify(body) });
    } catch {
      // LocalStorage simulation with real code generation
      const codeChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let bookingCode = 'SBT-';
      for (let i = 0; i < 6; i++) {
        bookingCode += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
      }
      const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

      // Mark selected seats as booked in localStorage
      const bookedKey = `sbt_booked_seats_${body.showId}`;
      const currentBooked: string[] = JSON.parse(localStorage.getItem(bookedKey) || '["E7","E8"]');
      const newSeatCodes = body.seatIds.map((id: string) => id.split('-').pop() || 'A1');
      localStorage.setItem(bookedKey, JSON.stringify([...currentBooked, ...newSeatCodes]));

      const all = getStoredMovies();
      const movie = all.find((m) => body.showId?.includes(m.id)) || all[0];

      const newBooking = {
        id: 'book-' + Date.now(),
        bookingCode,
        userId: 'usr-1',
        showId: body.showId,
        totalAmount: 335.40,
        convenienceFee: body.convenienceFee || 35.40,
        foodAmount: 0,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        show: {
          id: body.showId,
          date: new Date().toISOString().split('T')[0],
          startTime: '02:20 PM',
          movie,
          screen: THEATRE_KOVILPATTI.screens![0],
        },
        bookingSeats: newSeatCodes.map((code: string) => ({
          id: 'bs-' + code,
          seatId: 'seat-' + code,
          seatCode: code,
          price: 150,
        })),
        payment: {
          transactionId,
          method: body.paymentMethod || 'UPI',
          amount: 335.40,
          status: 'SUCCESS',
        },
      };

      const past = JSON.parse(localStorage.getItem('sbt_my_bookings') || '[]');
      localStorage.setItem('sbt_my_bookings', JSON.stringify([newBooking, ...past]));

      return { success: true, booking: newBooking };
    }
  },

  getBookingDetails: async (id: string) => {
    try {
      return await fetchApi<any>(`/bookings/${id}`);
    } catch {
      const past = JSON.parse(localStorage.getItem('sbt_my_bookings') || '[]');
      const found = past.find((b: any) => b.id === id || b.bookingCode === id);
      if (found) return { success: true, booking: found };

      return {
        success: true,
        booking: {
          id,
          bookingCode: id.startsWith('SBT-') ? id : 'SBT-8F42K9',
          totalAmount: 335.40,
          status: 'CONFIRMED',
          show: {
            date: new Date().toISOString().split('T')[0],
            startTime: '02:20 PM',
            movie: INITIAL_MOVIES[0],
            screen: THEATRE_KOVILPATTI.screens![0],
          },
          bookingSeats: [
            { id: '1', seatCode: 'E7', price: 150 },
            { id: '2', seatCode: 'E8', price: 150 },
          ],
          payment: { transactionId: 'TXN-984210', method: 'UPI', amount: 335.40 },
        },
      };
    }
  },

  getUserBookings: async () => {
    try {
      return await fetchApi<any>('/bookings/user');
    } catch {
      const past = JSON.parse(localStorage.getItem('sbt_my_bookings') || '[]');
      if (past.length > 0) {
        return { success: true, bookings: past };
      }
      return {
        success: true,
        bookings: [
          {
            id: 'book-seed-1',
            bookingCode: 'SBT-8F42K9',
            totalAmount: 335.40,
            status: 'CONFIRMED',
            show: {
              date: new Date().toISOString().split('T')[0],
              startTime: '02:20 PM',
              movie: INITIAL_MOVIES[0],
              screen: THEATRE_KOVILPATTI.screens![0],
            },
            bookingSeats: [
              { id: '1', seatCode: 'E7', price: 150 },
              { id: '2', seatCode: 'E8', price: 150 },
            ],
            payment: { transactionId: 'TXN-984210', method: 'UPI', amount: 335.40 },
          },
        ],
      };
    }
  },

  processPayment: async (body: any) => {
    try {
      return await fetchApi<any>('/payments', { method: 'POST', body: JSON.stringify(body) });
    } catch {
      return { success: true, payment: { transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`, status: 'SUCCESS' } };
    }
  },

  // Favorites
  getFavorites: async () => {
    try {
      return await fetchApi<any>('/favorites');
    } catch {
      const favs = JSON.parse(localStorage.getItem('sbt_favorites') || '[]');
      return { success: true, favorites: favs };
    }
  },

  addFavorite: async (movieId: string) => {
    try {
      return await fetchApi<any>('/favorites', { method: 'POST', body: JSON.stringify({ movieId }) });
    } catch {
      const all = getStoredMovies();
      const movie = all.find((m) => m.id === movieId);
      const favs = JSON.parse(localStorage.getItem('sbt_favorites') || '[]');
      if (movie && !favs.some((f: any) => f.id === movieId)) {
        localStorage.setItem('sbt_favorites', JSON.stringify([...favs, movie]));
      }
      return { success: true };
    }
  },

  removeFavorite: async (movieId: string) => {
    try {
      return await fetchApi<any>(`/favorites/${movieId}`, { method: 'DELETE' });
    } catch {
      const favs = JSON.parse(localStorage.getItem('sbt_favorites') || '[]');
      localStorage.setItem('sbt_favorites', JSON.stringify(favs.filter((f: any) => f.id !== movieId)));
      return { success: true };
    }
  },

  // Food & Offers
  getFoodItems: async () => {
    try {
      return await fetchApi<any>('/food');
    } catch {
      return { success: true, items: FOOD_ITEMS };
    }
  },

  getOffers: async () => {
    try {
      return await fetchApi<any>('/offers');
    } catch {
      return { success: true, offers: OFFERS };
    }
  },

  // Search
  search: async (query: string) => {
    try {
      return await fetchApi<any>(`/search?q=${encodeURIComponent(query)}`);
    } catch {
      const q = query.toLowerCase().trim();
      const all = getStoredMovies();
      const matchedMovies = all.filter(
        (m) =>
          !m.title.toLowerCase().includes('kalki') &&
          (m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q) || m.language.toLowerCase().includes(q))
      );

      const matchedCinemas =
        q.includes('sbt') || q.includes('kovilpatti') || q.includes('sathyabama') ? [THEATRE_KOVILPATTI] : [];

      return {
        success: true,
        query,
        results: {
          movies: matchedMovies,
          cinemas: matchedCinemas,
          showtimes: [],
        },
      };
    }
  },

  // Admin
  getAdminStats: async () => {
    try {
      return await fetchApi<any>('/admin/stats');
    } catch {
      const all = getStoredMovies();
      return {
        success: true,
        stats: {
          totalRevenue: 48920.0,
          totalBookings: 184,
          totalUsers: 92,
          totalMovies: all.length,
          activeShowsCount: 42,
          occupancyPercentage: 74,
        },
      };
    }
  },

  getAdminMovies: async () => {
    try {
      return await fetchApi<any>('/admin/movies');
    } catch {
      return { success: true, movies: getStoredMovies() };
    }
  },

  createAdminMovie: async (body: any) => {
    try {
      return await fetchApi<any>('/admin/movies', { method: 'POST', body: JSON.stringify(body) });
    } catch {
      const newMovie = {
        id: 'mov-' + Date.now(),
        ...body,
        active: true,
        availableShowtimesList: ['10:30 AM', '02:20 PM', '06:20 PM', '10:15 PM'],
        earliestShowtime: '10:30 AM',
      };
      const custom = JSON.parse(localStorage.getItem('sbt_custom_movies') || '[]');
      localStorage.setItem('sbt_custom_movies', JSON.stringify([newMovie, ...custom]));
      return { success: true, movie: newMovie };
    }
  },

  updateAdminMovie: async (id: string, body: any) => {
    try {
      return await fetchApi<any>(`/admin/movies/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    } catch {
      return { success: true };
    }
  },

  deleteAdminMovie: async (id: string) => {
    try {
      return await fetchApi<any>(`/admin/movies/${id}`, { method: 'DELETE' });
    } catch {
      const custom = JSON.parse(localStorage.getItem('sbt_custom_movies') || '[]');
      localStorage.setItem('sbt_custom_movies', JSON.stringify(custom.filter((m: any) => m.id !== id)));
      return { success: true };
    }
  },

  getAdminTheatres: async () => {
    try {
      return await fetchApi<any>('/admin/theatres');
    } catch {
      return { success: true, theatres: [THEATRE_KOVILPATTI] };
    }
  },

  createAdminShow: async (body: any) => {
    try {
      return await fetchApi<any>('/admin/shows', { method: 'POST', body: JSON.stringify(body) });
    } catch {
      const customShows = getStoredCustomShows();
      const newShow = { id: 'show-' + Date.now(), ...body };
      localStorage.setItem('sbt_custom_shows', JSON.stringify([...customShows, newShow]));
      return {
        success: true,
        message: 'Show created! The movie now appears in Now Showing.',
        show: newShow,
      };
    }
  },

  updateAdminShow: async (id: string, body: any) => {
    try {
      return await fetchApi<any>(`/admin/shows/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    } catch {
      return { success: true };
    }
  },

  deleteAdminShow: async (id: string) => {
    try {
      return await fetchApi<any>(`/admin/shows/${id}`, { method: 'DELETE' });
    } catch {
      const customShows = getStoredCustomShows().filter((s: any) => s.id !== id);
      localStorage.setItem('sbt_custom_shows', JSON.stringify(customShows));
      return { success: true };
    }
  },

  getAdminBookings: async () => {
    try {
      return await fetchApi<any>('/admin/bookings');
    } catch {
      return {
        success: true,
        bookings: [
          {
            id: 'b-1',
            bookingCode: 'SBT-8F42K9',
            totalAmount: 335.40,
            status: 'CONFIRMED',
            user: { name: 'Karthik Raja', email: 'guest@sbtcinemas.com', phone: '9842109876' },
            show: { date: '2026-10-07', startTime: '02:20 PM', movie: INITIAL_MOVIES[0], screen: THEATRE_KOVILPATTI.screens![0] },
            bookingSeats: [{ seatCode: 'E7' }, { seatCode: 'E8' }],
          },
        ],
      };
    }
  },

  getAdminUsers: async () => {
    try {
      return await fetchApi<any>('/admin/users');
    } catch {
      return {
        success: true,
        users: [
          { id: '1', name: 'SBT Kovilpatti Admin', email: 'admin@sbtcinemas.com', phone: '9842100001', role: 'ADMIN' },
          { id: '2', name: 'Karthik Raja', email: 'guest@sbtcinemas.com', phone: '9842109876', role: 'USER' },
        ],
      };
    }
  },
};
