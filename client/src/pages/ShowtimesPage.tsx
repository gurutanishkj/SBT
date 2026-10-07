import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, MapPin, Calendar, Film, Info, Volume2, Shield, Ticket } from 'lucide-react';
import { api } from '../api/client';
import { DateItem } from '../types';
import { useBooking } from '../context/BookingContext';

export const ShowtimesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setSelectedMovie, setSelectedDate, setSelectedShow } = useBooking();

  const [dates, setDates] = useState<DateItem[]>([]);
  const [selectedDate, setSelectedDateState] = useState<string>('');
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load available dates
  useEffect(() => {
    async function loadDates() {
      try {
        const res = await api.getDates();
        if (res.success && res.dates.length > 0) {
          setDates(res.dates);
          const paramDate = searchParams.get('date');
          const initialDate = paramDate || res.dates[0].dateString;
          setSelectedDateState(initialDate);
          setSelectedDate(initialDate);
        }
      } catch (err) {
        console.error('Failed to load dates', err);
      }
    }
    loadDates();
  }, []);

  // Fetch shows whenever selectedDate changes
  useEffect(() => {
    async function loadShowsForDate() {
      if (!selectedDate) return;
      setLoading(true);
      try {
        const res = await api.getShows(selectedDate);
        if (res.success) {
          setShows(res.shows);
        }
      } catch (err) {
        console.error('Failed to load shows for date', err);
      } finally {
        setLoading(false);
      }
    }
    loadShowsForDate();
  }, [selectedDate]);

  const handleDateChange = (dateStr: string) => {
    setSelectedDateState(dateStr);
    setSelectedDate(dateStr);
    setSearchParams({ date: dateStr });
  };

  // Group shows by Movie
  const moviesGrouped = shows.reduce((acc: { [key: string]: { movie: any; shows: any[] } }, show: any) => {
    const movieId = show.movie.id;
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: show.movie,
        shows: [],
      };
    }
    acc[movieId].shows.push(show);
    return acc;
  }, {});

  const movieList = Object.values(moviesGrouped);

  const handleSelectShowtime = (movie: any, show: any) => {
    if (show.status === 'SOLD_OUT' || show.status === 'DISABLED') return;
    setSelectedMovie(movie);
    setSelectedDate(selectedDate);
    setSelectedShow(show);
    navigate(`/book/${show.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Fixed Cinema Header */}
      <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sbt-pink/15 text-sbt-pink text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>OFFICIAL THEATRICAL SCHEDULE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              SATHYABAMA MULTIPLEX (SBT CINEMAS)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-sbt-dark border border-sbt-border text-xs font-bold text-sbt-gold flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-sbt-pink" /> Dolby Atmos 4K
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-sbt-dark border border-sbt-border text-xs font-bold text-emerald-400">
              VIP Recliners Available
            </span>
          </div>
        </div>

        {/* Dynamic Horizontal Date Selector (TODAY, THU 08 OCT, etc.) */}
        <div className="pt-4 border-t border-sbt-border">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {dates.map((d) => {
              const isSelected = selectedDate === d.dateString;
              return (
                <button
                  key={d.dateString}
                  onClick={() => handleDateChange(d.dateString)}
                  className={`flex flex-col items-center min-w-[95px] py-3 px-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-sbt-gold to-sbt-goldDark text-sbt-dark border-sbt-gold font-black shadow-glow-gold scale-105'
                      : 'bg-sbt-dark hover:bg-sbt-cardHover border-sbt-border text-slate-300'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-sbt-dark' : 'text-slate-400'}`}>
                    {d.dayName}
                  </span>
                  <span className="text-xl font-black">{d.dayNumber}</span>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-sbt-dark' : 'text-slate-400'}`}>
                    {d.monthName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Showtimes Status Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 px-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Fast Filling</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Sold Out</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-600" />
          <span>Disabled / Inactive</span>
        </div>
      </div>

      {/* Movie-wise Showtimes List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-sbt-card rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : movieList.length === 0 ? (
        <div className="text-center py-16 bg-sbt-card rounded-3xl border border-sbt-border p-8">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No shows scheduled for this date</h3>
          <p className="text-xs text-slate-400 mt-1">Please select another date from the calendar strip above.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {movieList.map(({ movie, shows: movieShows }) => (
            <div
              key={movie.id}
              className="bg-sbt-card border border-sbt-border/80 hover:border-sbt-border rounded-3xl p-5 sm:p-6 shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Movie Quick Overview */}
                <div className="flex items-start space-x-4">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-16 h-24 rounded-xl object-cover shrink-0 bg-slate-900 border border-sbt-border cursor-pointer"
                    onClick={() => navigate(`/movies/${movie.id}`)}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-sbt-gold text-sbt-dark uppercase">
                        {movie.format || '2D'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white uppercase">
                        {movie.certificate}
                      </span>
                    </div>

                    <h3
                      onClick={() => navigate(`/movies/${movie.id}`)}
                      className="text-lg sm:text-xl font-black text-white hover:text-sbt-gold cursor-pointer transition-colors uppercase tracking-wide"
                    >
                      {movie.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium">
                      {movie.language} • {movie.genre} • {movie.duration}m
                    </p>

                    <p className="text-[11px] text-sbt-gold font-semibold">
                      SATHYABAMA MULTIPLEX (SBT CINEMAS), Kovilpatti
                    </p>
                  </div>
                </div>

                {/* Showtimes Buttons Grid */}
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  {movieShows.map((show: any) => {
                    const isSoldOut = show.status === 'SOLD_OUT';
                    const isFastFilling = show.status === 'FAST_FILLING';
                    const isDisabled = show.status === 'DISABLED';

                    return (
                      <button
                        key={show.id}
                        disabled={isSoldOut || isDisabled}
                        onClick={() => handleSelectShowtime(movie, show)}
                        className={`group px-4 py-3 rounded-xl border flex flex-col items-center justify-center min-w-[110px] transition-all ${
                          isSoldOut
                            ? 'bg-sbt-dark/40 border-sbt-border opacity-50 cursor-not-allowed'
                            : isDisabled
                            ? 'bg-sbt-dark/20 border-sbt-border/40 opacity-40 cursor-not-allowed'
                            : 'bg-sbt-dark hover:bg-sbt-cardHover border-sbt-border hover:border-sbt-gold text-white shadow-sm hover:shadow-glow-gold/20 transform hover:-translate-y-0.5'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-black tracking-wide group-hover:text-sbt-gold transition-colors">
                          {show.startTime}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {show.screen?.name || 'Screen 1'}
                        </span>

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

                        <span className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                          ₹{show.priceClassic}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
