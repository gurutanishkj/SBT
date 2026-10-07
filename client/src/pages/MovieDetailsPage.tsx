import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Film, MapPin, Heart, Ticket, Check, Volume2, Shield } from 'lucide-react';
import { api } from '../api/client';
import { Movie, DateItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAuth();
  const { setSelectedMovie, setSelectedDate, setSelectedShow } = useBooking();

  const [movie, setMovie] = useState<any | null>(null);
  const [dates, setDates] = useState<DateItem[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState<string>('');
  const [dateShows, setDateShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovieDetails() {
      if (!id) return;
      try {
        setLoading(true);
        const [movRes, datesRes] = await Promise.all([
          api.getMovieDetails(id),
          api.getDates(),
        ]);

        if (movRes.success) {
          setMovie(movRes.movie);
          setSelectedMovie(movRes.movie);
        }

        if (datesRes.success && datesRes.dates.length > 0) {
          setDates(datesRes.dates);
          const initialDate = datesRes.dates[0].dateString;
          setSelectedDateKey(initialDate);
          setSelectedDate(initialDate);
        }
      } catch (err) {
        console.error('Failed to load movie details', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovieDetails();
  }, [id]);

  // Load shows for selected date
  useEffect(() => {
    async function fetchDateShows() {
      if (!id || !selectedDateKey) return;
      try {
        const res = await api.getMovieShows(id, selectedDateKey);
        if (res.success) {
          setDateShows(res.shows);
        }
      } catch (err) {
        console.error('Failed to fetch shows for date', err);
      }
    }
    fetchDateShows();
  }, [id, selectedDateKey]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sbt-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Film className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Movie not found</h2>
        <p className="text-slate-400 mt-2 text-sm">The requested film may have ended its theatrical run.</p>
        <button
          onClick={() => navigate('/movies')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-sbt-gold text-sbt-dark font-bold text-xs"
        >
          Browse All Movies
        </button>
      </div>
    );
  }

  const isFavoriteActive = isFavorite(movie.id);
  const isComingSoon = movie.status === 'COMING_SOON';
  const hasActiveShows = movie.hasActiveShows || dateShows.length > 0;

  const handleSelectShow = (show: any) => {
    setSelectedMovie(movie);
    setSelectedDate(selectedDateKey);
    setSelectedShow(show);
    navigate(`/book/${show.id}`);
  };

  return (
    <div className="pb-24">
      {/* Backdrop Header */}
      <div className="relative w-full h-[380px] lg:h-[460px] overflow-hidden bg-black">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sbt-dark via-sbt-dark/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-sbt-dark via-sbt-dark/40 to-transparent" />
      </div>

      {/* Main Content Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Poster Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-sbt-border/80 aspect-[2/3] group bg-slate-900">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => toggleFavorite(movie)}
                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isFavoriteActive
                    ? 'bg-rose-500 text-white shadow-glow-pink scale-110'
                    : 'bg-black/60 text-slate-300 hover:text-white'
                }`}
                aria-label="Toggle Favorite"
              >
                <Heart className={`w-5 h-5 ${isFavoriteActive ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-5">
            {/* Title & Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-sbt-gold text-sbt-dark text-xs font-black uppercase">
                  {movie.format || '2D'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-xs font-bold border border-white/20 uppercase">
                  {movie.certificate}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sbt-card text-sbt-pink text-xs font-bold border border-sbt-border">
                  {movie.language}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center space-x-1 text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  <Star className="w-4 h-4 fill-current text-sbt-gold" />
                  <span>{movie.rating.toFixed(1)} / 10 Rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{movie.duration} Minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Released: {movie.releaseDate}</span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-sbt-gold uppercase tracking-wider">Synopsis</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {movie.description}
              </p>
            </div>

            {/* Crew Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-sbt-border">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Director</span>
                <p className="text-xs font-bold text-white mt-0.5">{movie.director}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Star Cast</span>
                <p className="text-xs font-bold text-white mt-0.5">{movie.cast}</p>
              </div>
            </div>

            {/* Cinema Location Banner */}
            <div className="bg-sbt-card p-4 rounded-2xl border border-sbt-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-sbt-pink/15 text-sbt-pink flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">SATHYABAMA MULTIPLEX (SBT CINEMAS)</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-sbt-gold bg-sbt-dark px-3 py-1.5 rounded-xl border border-sbt-border shrink-0">
                <Volume2 className="w-4 h-4" />
                <span>Dolby Atmos 4K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes & Booking Section */}
        <div className="mt-12 bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sbt-border pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                SELECT DATE & SHOWTIME
              </h2>
              <p className="text-xs text-slate-400">
                Real-time seating availability for SBT CINEMAS, Kovilpatti
              </p>
            </div>

            {/* If Coming soon, show notice */}
            {isComingSoon && (
              <div className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                COMING SOON — BOOKINGS OPEN SHORTLY
              </div>
            )}
          </div>

          {!isComingSoon && (
            <>
              {/* Horizontal Date Picker */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {dates.map((d) => {
                  const isSelected = selectedDateKey === d.dateString;
                  return (
                    <button
                      key={d.dateString}
                      onClick={() => {
                        setSelectedDateKey(d.dateString);
                        setSelectedDate(d.dateString);
                      }}
                      className={`flex flex-col items-center min-w-[90px] py-3 px-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-sbt-gold to-sbt-goldDark text-sbt-dark border-sbt-gold font-black shadow-glow-gold scale-105'
                          : 'bg-sbt-dark hover:bg-sbt-cardHover border-sbt-border text-slate-300'
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-sbt-dark' : 'text-slate-400'}`}>
                        {d.dayName}
                      </span>
                      <span className="text-lg font-black">{d.dayNumber}</span>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-sbt-dark' : 'text-slate-400'}`}>
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Showtimes Grid */}
              <div className="space-y-4 pt-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Available Showtimes for {selectedDateKey}
                </div>

                {dateShows.length === 0 ? (
                  <div className="text-center py-10 bg-sbt-dark rounded-2xl border border-sbt-border">
                    <p className="text-xs text-slate-400">No shows scheduled for this selected date.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {dateShows.map((show) => {
                      const isSoldOut = show.status === 'SOLD_OUT';
                      const isFastFilling = show.status === 'FAST_FILLING';

                      return (
                        <button
                          key={show.id}
                          disabled={isSoldOut}
                          onClick={() => handleSelectShow(show)}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            isSoldOut
                              ? 'bg-sbt-dark/40 border-sbt-border opacity-50 cursor-not-allowed'
                              : 'bg-sbt-dark hover:bg-sbt-cardHover border-sbt-border hover:border-sbt-gold/60 shadow-sm hover:shadow-glow-gold/20 transform hover:-translate-y-0.5'
                          }`}
                        >
                          <span className="text-sm font-black text-white">{show.startTime}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{show.screen?.name || 'Screen 1'}</span>

                          {isSoldOut ? (
                            <span className="mt-1 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                              SOLD OUT
                            </span>
                          ) : isFastFilling ? (
                            <span className="mt-1 text-[9px] font-extrabold text-amber-400 uppercase tracking-widest">
                              FAST FILLING
                            </span>
                          ) : (
                            <span className="mt-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                              AVAILABLE
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400 mt-1 font-semibold">
                            ₹{show.priceClassic} onwards
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
