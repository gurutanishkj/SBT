import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { MovieCard } from '../components/MovieCard';
import { Movie, DateItem } from '../types';
import { api } from '../api/client';
import {
  Film,
  Sparkles,
  MapPin,
  Clock,
  Tv,
  Volume2,
  Car,
  Coffee,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [dates, setDates] = useState<DateItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [nsRes, upRes, datesRes] = await Promise.all([
          api.getNowShowing(),
          api.getUpcoming(),
          api.getDates(),
        ]);

        if (nsRes.success) setNowShowing(nsRes.movies);
        if (upRes.success) setUpcoming(upRes.movies);
        if (datesRes.success) {
          setDates(datesRes.dates);
          if (datesRes.dates.length > 0) {
            setSelectedDate(datesRes.dates[0].dateString);
          }
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Major featured upcoming movie: Avengers: Doomsday
  const featuredUpcoming = upcoming.find((m) => m.title.includes('Avengers')) || upcoming[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner: AVENGERS: DOOMSDAY (Coming Soon — Dec 18, 2026) */}
      <HeroBanner movie={featuredUpcoming} />

      {/* Dynamic Date Filter Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sbt-card/80 backdrop-blur-md border border-sbt-border rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-sbt-gold" />
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Select Show Date (IST)
                </h2>
                <p className="text-[11px] text-slate-400">
                  Real-time schedule for Sathyabama Multiplex, Kovilpatti
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/showtimes')}
              className="inline-flex items-center space-x-1 text-xs font-bold text-sbt-gold hover:text-sbt-goldLight transition-colors"
            >
              <span>View All Showtimes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal dynamic date pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {dates.map((d) => {
              const isSelected = selectedDate === d.dateString;
              return (
                <button
                  key={d.dateString}
                  onClick={() => {
                    setSelectedDate(d.dateString);
                    navigate(`/showtimes?date=${d.dateString}`);
                  }}
                  className={`flex flex-col items-center min-w-[85px] sm:min-w-[100px] py-2.5 px-3 rounded-xl border transition-all transform hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-gradient-to-b from-sbt-gold to-sbt-goldDark text-sbt-dark border-sbt-gold font-black shadow-glow-gold'
                      : 'bg-sbt-dark hover:bg-sbt-cardHover border-sbt-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-sbt-dark' : 'text-slate-400'}`}>
                    {d.dayName}
                  </span>
                  <span className="text-base font-black tracking-tight">{d.dayNumber}</span>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-sbt-dark' : 'text-slate-400'}`}>
                    {d.monthName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* NOW SHOWING IN KOVILPATTI Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-sbt-border pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sbt-pink/15 text-sbt-pink text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>LIVE MOVIES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              NOW SHOWING IN KOVILPATTI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Directly playing at <strong className="text-slate-200">SATHYABAMA MULTIPLEX (SBT CINEMAS)</strong>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-white">{nowShowing.length}</strong> active releases
            </span>
          </div>
        </div>

        {/* Loading Skeleton or Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[2/3] bg-sbt-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : nowShowing.length === 0 ? (
          <div className="text-center py-12 bg-sbt-card rounded-2xl border border-sbt-border p-8">
            <Film className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No active shows right now</h3>
            <p className="text-xs text-slate-400 mt-1">Please check back soon for updated show listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nowShowing.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Multiplex Facilities Showcase: SATHYABAMA MULTIPLEX (SBT CINEMAS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sbt-card via-[#151824] to-sbt-card border border-sbt-border p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sbt-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sbt-gold/15 text-sbt-gold text-xs font-bold border border-sbt-gold/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ULTIMATE KOVILPATTI EXPERIENCE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
              SATHYABAMA MULTIPLEX <br />
              <span className="text-gold-gradient">SBT CINEMAS</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Equipped with Barco 4K Laser Projection, immersive Dolby Atmos 64-channel surround acoustic architecture, motorized luxury VIP recliners, and gourmet snack lounges. Experience cinema the way masters envisioned it.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="flex flex-col items-center sm:items-start p-3.5 rounded-2xl bg-sbt-dark/60 border border-sbt-border">
                <Tv className="w-6 h-6 text-sbt-gold mb-2" />
                <span className="text-xs font-bold text-white">4K Laser</span>
                <span className="text-[10px] text-slate-400">Ultra-sharp clarity</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-3.5 rounded-2xl bg-sbt-dark/60 border border-sbt-border">
                <Volume2 className="w-6 h-6 text-sbt-pink mb-2" />
                <span className="text-xs font-bold text-white">Dolby Atmos</span>
                <span className="text-[10px] text-slate-400">Spatial sound</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-3.5 rounded-2xl bg-sbt-dark/60 border border-sbt-border">
                <Coffee className="w-6 h-6 text-amber-400 mb-2" />
                <span className="text-xs font-bold text-white">SBT Cafe</span>
                <span className="text-[10px] text-slate-400">Gourmet popcorn & treats</span>
              </div>

              <div className="flex flex-col items-center sm:items-start p-3.5 rounded-2xl bg-sbt-dark/60 border border-sbt-border">
                <Car className="w-6 h-6 text-emerald-400 mb-2" />
                <span className="text-xs font-bold text-white">Ample Parking</span>
                <span className="text-[10px] text-slate-400">Dedicated bays</span>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-sbt-pink" />
              <span>
                Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Coming Soon Section */}
      {upcoming.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-sbt-border pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>ANTICIPATED RELEASES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                COMING SOON TO SBT CINEMAS
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcoming.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
