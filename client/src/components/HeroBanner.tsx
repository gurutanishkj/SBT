import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star, Info } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movie?: Movie;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movie }) => {
  const navigate = useNavigate();

  // Default featured upcoming movie: Avengers: Doomsday
  const title = movie?.title || 'Avengers: Doomsday';
  const releaseDateLabel = 'COMING SOON — DECEMBER 18, 2026';
  const description =
    movie?.description ||
    'The Marvel Multiverse faces ultimate doom as Victor Von Doom rises. Earth’s mightiest champions must forge desperate alliances across timelines to stave off total annihilation.';
  const backdrop =
    movie?.backdropUrl ||
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80';

  return (
    <div className="relative w-full min-h-[500px] lg:min-h-[580px] flex items-center overflow-hidden bg-black">
      {/* Backdrop Image with layered gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={backdrop}
          alt={title}
          className="w-full h-full object-cover object-center opacity-45 scale-105 transform animate-pulse duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sbt-dark via-sbt-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-sbt-dark via-sbt-dark/80 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sbt-dark/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-2xl space-y-5">
          {/* Prominent Coming Soon Ribbon */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-glow-gold">
            <Calendar className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-xs font-black tracking-widest uppercase">
              {releaseDateLabel}
            </span>
          </div>

          {/* Movie Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none drop-shadow-2xl">
            {title}
          </h1>

          {/* Meta Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
            <span className="px-2.5 py-1 rounded-md bg-sbt-gold text-sbt-dark font-extrabold uppercase">
              3D • 2D
            </span>
            <span className="px-2 py-1 rounded-md bg-white/10 backdrop-blur border border-white/20 text-white">
              UA13+
            </span>
            <span className="text-slate-300">Action / Adventure / Superhero</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-current text-sbt-gold" /> 9.6 Anticipation
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal drop-shadow">
            {description}
          </p>

          {/* Action Button: EXPLORE MOVIE */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => {
                if (movie?.id) navigate(`/movies/${movie.id}`);
                else navigate('/movies');
              }}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-sbt-gold hover:bg-sbt-goldLight text-sbt-dark font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-glow-gold transform hover:-translate-y-0.5"
            >
              <Info className="w-4 h-4" />
              <span>EXPLORE MOVIE</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 italic pt-1">
            * Showtimes will be released exclusively at SATHYABAMA MULTIPLEX (SBT CINEMAS), Kovilpatti closer to release.
          </div>
        </div>
      </div>
    </div>
  );
};

