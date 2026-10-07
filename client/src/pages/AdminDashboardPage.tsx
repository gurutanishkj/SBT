import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Ticket,
  Film,
  Users,
  Plus,
  Trash2,
  Edit,
  Clock,
  Tv,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const AdminDashboardPage: React.FC = () => {
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SHOWS' | 'MOVIES' | 'BOOKINGS'>('OVERVIEW');
  const [stats, setStats] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [theatres, setTheatres] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add Show form state
  const [newShowMovieId, setNewShowMovieId] = useState('');
  const [newShowScreenId, setNewShowScreenId] = useState('');
  const [newShowDate, setNewShowDate] = useState('2026-10-07');
  const [newShowTime, setNewShowTime] = useState('04:30 PM');
  const [newShowPriceClassic, setNewShowPriceClassic] = useState(150);
  const [newShowPricePremium, setNewShowPricePremium] = useState(190);
  const [newShowPriceRecliner, setNewShowPriceRecliner] = useState(250);

  // Add Movie form state
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieLanguage, setNewMovieLanguage] = useState('Tamil');
  const [newMovieFormat, setNewMovieFormat] = useState('2D');
  const [newMovieCert, setNewMovieCert] = useState('UA13+');
  const [newMovieGenre, setNewMovieGenre] = useState('Action / Mass Drama');
  const [newMovieDuration, setNewMovieDuration] = useState(145);
  const [newMovieRating, setNewMovieRating] = useState(8.5);
  const [newMovieRelease, setNewMovieRelease] = useState('2026-10-07');
  const [newMovieStatus, setNewMovieStatus] = useState('NOW_SHOWING');
  const [newMovieDesc, setNewMovieDesc] = useState('');
  const [newMovieDirector, setNewMovieDirector] = useState('');
  const [newMovieCast, setNewMovieCast] = useState('');
  const [newMoviePoster, setNewMoviePoster] = useState('');

  const isAdmin = user && user.role === 'ADMIN';

  useEffect(() => {
    async function loadAdminData() {
      if (!isAdmin) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [statsRes, movRes, thRes, bookRes] = await Promise.all([
          api.getAdminStats(),
          api.getAdminMovies(),
          api.getAdminTheatres(),
          api.getAdminBookings(),
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (movRes.success) {
          setMovies(movRes.movies);
          if (movRes.movies.length > 0) setNewShowMovieId(movRes.movies[0].id);
        }
        if (thRes.success) {
          setTheatres(thRes.theatres);
          if (thRes.theatres[0]?.screens?.length > 0) {
            setNewShowScreenId(thRes.theatres[0].screens[0].id);
          }
        }
        if (bookRes.success) setBookings(bookRes.bookings);
      } catch (err: any) {
        console.error('Failed to load admin data', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [isAdmin]);

  const handleAdminQuickLogin = async () => {
    try {
      await login('admin@sbtcinemas.com', 'Admin@SBT2026');
    } catch (err: any) {
      alert(err.message || 'Login failed');
    }
  };

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.createAdminShow({
        movieId: newShowMovieId,
        screenId: newShowScreenId,
        date: newShowDate,
        startTime: newShowTime,
        priceClassic: newShowPriceClassic,
        pricePremium: newShowPricePremium,
        priceRecliner: newShowPriceRecliner,
      });

      if (res.success) {
        setMessage({
          type: 'success',
          text: `Show created! The movie now has active shows in DB and appears automatically in Now Showing!`,
        });
        // Refresh stats
        const statsRes = await api.getAdminStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create show' });
    }
  };

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.createAdminMovie({
        title: newMovieTitle,
        language: newMovieLanguage,
        format: newMovieFormat,
        certificate: newMovieCert,
        genre: newMovieGenre,
        duration: newMovieDuration,
        rating: newMovieRating,
        releaseDate: newMovieRelease,
        status: newMovieStatus,
        description: newMovieDesc || 'Premiering at Sathyabama Multiplex, Kovilpatti.',
        director: newMovieDirector || 'Director',
        cast: newMovieCast || 'Leading Stars',
        posterUrl: newMoviePoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop&q=80',
      });

      if (res.success) {
        setMessage({ type: 'success', text: `Movie '${res.movie.title}' created successfully!` });
        setMovies((prev) => [res.movie, ...prev]);
        setNewMovieTitle('');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create movie' });
    }
  };

  const handleDeleteMovie = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    try {
      await api.deleteAdminMovie(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      setMessage({ type: 'success', text: 'Movie removed from database.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete movie' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase">Admin Portal Restricted</h2>
        <p className="text-xs text-slate-400">
          Please log in with administrator privileges to manage Kovilpatti screens, movies, and showtimes.
        </p>
        <button
          onClick={handleAdminQuickLogin}
          className="w-full py-3 rounded-xl bg-sbt-gold text-sbt-dark font-black text-xs uppercase tracking-wider shadow-glow-gold hover:bg-sbt-goldLight transition-all"
        >
          Sign In as SBT Kovilpatti Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sbt-border pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SBT CINEMAS CONTROL CONSOLE</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-slate-400">
            Real-time management for SATHYABAMA MULTIPLEX (SBT CINEMAS), Kovilpatti
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center bg-sbt-card p-1 rounded-2xl border border-sbt-border">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'OVERVIEW' ? 'bg-sbt-gold text-sbt-dark' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('SHOWS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'SHOWS' ? 'bg-sbt-gold text-sbt-dark' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Shows
          </button>
          <button
            onClick={() => setActiveTab('MOVIES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'MOVIES' ? 'bg-sbt-gold text-sbt-dark' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Movies
          </button>
          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'BOOKINGS' ? 'bg-sbt-gold text-sbt-dark' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bookings
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="text-3xl font-black text-sbt-gold">
                ₹{stats?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold">From confirmed bookings</p>
            </div>

            <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="text-3xl font-black text-white">{stats?.totalBookings || 0}</div>
              <p className="text-[10px] text-slate-400">Total patron reservations</p>
            </div>

            <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Movies
              </span>
              <div className="text-3xl font-black text-sbt-pink">{stats?.totalMovies || 0}</div>
              <p className="text-[10px] text-slate-400">In Kovilpatti multiplex</p>
            </div>

            <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Seat Occupancy
              </span>
              <div className="text-3xl font-black text-amber-400">
                {stats?.occupancyPercentage || 42}%
              </div>
              <p className="text-[10px] text-slate-400">Screen 1 & 2 utilization</p>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-sbt-card border border-sbt-gold/30 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sbt-gold" /> Real-Time Show Propagation
              </h4>
              <p className="text-xs text-slate-300">
                When an active show is scheduled in this panel for Kovilpatti, <code>/api/movies/now-showing</code> dynamically includes it instantly without code change.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('SHOWS')}
              className="px-4 py-2 rounded-xl bg-sbt-gold text-sbt-dark font-black text-xs uppercase shrink-0"
            >
              Add Show Now
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE SHOWS */}
      {activeTab === 'SHOWS' && (
        <div className="space-y-8">
          {/* Add Show Form */}
          <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-sbt-border pb-4">
              <span className="text-[10px] font-bold text-sbt-gold uppercase tracking-wider">
                Scheduler
              </span>
              <h3 className="text-xl font-black text-white uppercase">ADD NEW SHOWTIME</h3>
              <p className="text-xs text-slate-400 mt-1">
                Assign a movie to a screen in Sathyabama Multiplex, Kovilpatti.
              </p>
            </div>

            <form onSubmit={handleCreateShow} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Select Movie
                </label>
                <select
                  value={newShowMovieId}
                  onChange={(e) => setNewShowMovieId(e.target.value)}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Select Screen
                </label>
                <select
                  value={newShowScreenId}
                  onChange={(e) => setNewShowScreenId(e.target.value)}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                >
                  {theatres[0]?.screens?.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.totalSeats} Seats)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Show Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  required
                  value={newShowDate}
                  onChange={(e) => setNewShowDate(e.target.value)}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Start Time (e.g. 04:30 PM)
                </label>
                <input
                  type="text"
                  required
                  value={newShowTime}
                  onChange={(e) => setNewShowTime(e.target.value)}
                  placeholder="04:30 PM"
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Classic Price (₹)
                </label>
                <input
                  type="number"
                  value={newShowPriceClassic}
                  onChange={(e) => setNewShowPriceClassic(Number(e.target.value))}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Recliner VIP Price (₹)
                </label>
                <input
                  type="number"
                  value={newShowPriceRecliner}
                  onChange={(e) => setNewShowPriceRecliner(Number(e.target.value))}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-sbt-gold text-sbt-dark font-black text-xs uppercase tracking-wider shadow-glow-gold hover:bg-sbt-goldLight transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>PUBLISH SHOWTIME TO DATABASE</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE MOVIES */}
      {activeTab === 'MOVIES' && (
        <div className="space-y-8">
          {/* Add Movie Form */}
          <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-black text-white uppercase">ADD NEW MOVIE</h3>
            <form onSubmit={handleCreateMovie} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Movie Title
                </label>
                <input
                  type="text"
                  required
                  value={newMovieTitle}
                  onChange={(e) => setNewMovieTitle(e.target.value)}
                  placeholder="e.g. Thalapathy 69"
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={newMovieLanguage}
                  onChange={(e) => setNewMovieLanguage(e.target.value)}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Certificate
                </label>
                <select
                  value={newMovieCert}
                  onChange={(e) => setNewMovieCert(e.target.value)}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                >
                  <option value="U">U</option>
                  <option value="UA13+">UA13+</option>
                  <option value="UA16+">UA16+</option>
                  <option value="A">A</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Genre
                </label>
                <input
                  type="text"
                  value={newMovieGenre}
                  onChange={(e) => setNewMovieGenre(e.target.value)}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Duration (Mins)
                </label>
                <input
                  type="number"
                  value={newMovieDuration}
                  onChange={(e) => setNewMovieDuration(Number(e.target.value))}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Status
                </label>
                <select
                  value={newMovieStatus}
                  onChange={(e) => setNewMovieStatus(e.target.value)}
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
                >
                  <option value="NOW_SHOWING">Now Showing</option>
                  <option value="COMING_SOON">Coming Soon</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-sbt-gold text-sbt-dark font-black text-xs uppercase shadow-glow-gold hover:bg-sbt-goldLight"
                >
                  CREATE MOVIE RECORD
                </button>
              </div>
            </form>
          </div>

          {/* Current Movies List */}
          <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black text-white uppercase">EXISTING CATALOG</h3>
            <div className="divide-y divide-sbt-border/60">
              {movies.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={m.posterUrl} alt={m.title} className="w-10 h-14 rounded object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">{m.title}</h4>
                      <p className="text-[10px] text-slate-400">
                        {m.language} • {m.genre} • {m.certificate} • {m.status}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMovie(m.id)}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BOOKINGS */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-xl font-black text-white uppercase">RECENT BOOKINGS</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sbt-dark text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Patron</th>
                  <th className="p-3">Movie</th>
                  <th className="p-3">Showtime</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sbt-border text-slate-300">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-sbt-dark/50">
                    <td className="p-3 font-mono font-bold text-white">{b.bookingCode}</td>
                    <td className="p-3">{b.user?.name || 'Patron'}</td>
                    <td className="p-3 font-semibold text-white">{b.show?.movie?.title}</td>
                    <td className="p-3">
                      {b.show?.date} • {b.show?.startTime}
                    </td>
                    <td className="p-3 font-black text-sbt-pink">
                      {b.bookingSeats?.map((s: any) => s.seatCode).join(', ')}
                    </td>
                    <td className="p-3 font-bold text-sbt-gold">₹{b.totalAmount?.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
