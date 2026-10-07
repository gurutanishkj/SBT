const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('sbt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export const api = {
  // Auth
  register: (body: any) => fetchApi<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => fetchApi<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => fetchApi<any>('/auth/me'),
  logout: () => fetchApi<any>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) => fetchApi<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Movies
  getNowShowing: () => fetchApi<any>('/movies/now-showing'),
  getUpcoming: () => fetchApi<any>('/movies/upcoming'),
  getMovieDetails: (id: string) => fetchApi<any>(`/movies/${id}`),
  getMovieShows: (id: string, date?: string) => fetchApi<any>(`/movies/${id}/shows${date ? `?date=${date}` : ''}`),

  // Shows & Dates
  getDates: () => fetchApi<any>('/shows/dates'),
  getShows: (date?: string, movieId?: string) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (movieId) params.append('movieId', movieId);
    return fetchApi<any>(`/shows?${params.toString()}`);
  },
  getShowSeats: (showId: string) => fetchApi<any>(`/shows/${showId}/seats`),

  // Cinemas
  getCinemas: () => fetchApi<any>('/cinemas'),
  getCinemaDetails: (id: string) => fetchApi<any>(`/cinemas/${id}`),

  // Bookings & Payments
  createBooking: (body: any) => fetchApi<any>('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  getBookingDetails: (id: string) => fetchApi<any>(`/bookings/${id}`),
  getUserBookings: () => fetchApi<any>('/bookings/user'),
  processPayment: (body: any) => fetchApi<any>('/payments', { method: 'POST', body: JSON.stringify(body) }),

  // Favorites
  getFavorites: () => fetchApi<any>('/favorites'),
  addFavorite: (movieId: string) => fetchApi<any>('/favorites', { method: 'POST', body: JSON.stringify({ movieId }) }),
  removeFavorite: (movieId: string) => fetchApi<any>(`/favorites/${movieId}`, { method: 'DELETE' }),

  // Food & Offers
  getFoodItems: () => fetchApi<any>('/food'),
  getOffers: () => fetchApi<any>('/offers'),

  // Search
  search: (query: string) => fetchApi<any>(`/search?q=${encodeURIComponent(query)}`),

  // Admin
  getAdminStats: () => fetchApi<any>('/admin/stats'),
  getAdminMovies: () => fetchApi<any>('/admin/movies'),
  createAdminMovie: (body: any) => fetchApi<any>('/admin/movies', { method: 'POST', body: JSON.stringify(body) }),
  updateAdminMovie: (id: string, body: any) => fetchApi<any>(`/admin/movies/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAdminMovie: (id: string) => fetchApi<any>(`/admin/movies/${id}`, { method: 'DELETE' }),
  getAdminTheatres: () => fetchApi<any>('/admin/theatres'),
  createAdminShow: (body: any) => fetchApi<any>('/admin/shows', { method: 'POST', body: JSON.stringify(body) }),
  updateAdminShow: (id: string, body: any) => fetchApi<any>(`/admin/shows/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAdminShow: (id: string) => fetchApi<any>(`/admin/shows/${id}`, { method: 'DELETE' }),
  getAdminBookings: () => fetchApi<any>('/admin/bookings'),
  getAdminUsers: () => fetchApi<any>('/admin/users'),
};
