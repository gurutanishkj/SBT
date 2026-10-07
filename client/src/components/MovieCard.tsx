import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Clock, Ticket, MapPin } from 'lucide-react';
import { Movie } from '../types';
import { useAuth } from '../context/AuthContext';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAuth();
  const favorite = isFavorite(movie.id);

  const isComingSoon = movie.status === 'COMING_SOON';

  return (
    <div className="group relative flex flex-col bg-sbt-card border border-sbt-border/80 hover:border-sbt-gold/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-glow-gold/20 transition-all duration-300 transform hover:-translate-y-1">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-sbt-card via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            favorite
              ? 'bg-rose-500 text-white shadow-glow-pink scale-110'
              : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
          }`}
          aria-label="Add to favorites"
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Format & Certificate Tags */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-sbt-gold text-sbt-dark uppercase tracking-wider shadow">
            {movie.format || '2D'}
          </span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur text-slate-200 border border-white/10 uppercase">
            {movie.certificate}
          </span>
        </div>

        {/* Rating and Duration badge at bottom of poster */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md text-amber-300 font-bold border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-current text-sbt-gold" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md text-slate-300 text-[11px] font-medium border border-white/10">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{movie.duration}m</span>
          </div>
        </div>
      </div>

      {/* Movie Details Content */}
      <div className="flex flex-col flex-1 p-4 space-y-3 justify-between">
        <div>
          {/* Title */}
          <h3
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="font-extrabold text-base text-white hover:text-sbt-gold transition-colors line-clamp-1 cursor-pointer tracking-wide uppercase"
          >
            {movie.title}
          </h3>

          {/* Language & Genre */}
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {movie.language} • {movie.genre}
          </p>

          {/* Cinema Location */}
          <div className="flex items-center space-x-1 text-[11px] text-sbt-gold font-semibold mt-2">
            <MapPin className="w-3 h-3 text-sbt-pink shrink-0" />
            <span className="truncate">SBT CINEMAS • Kovilpatti</span>
          </div>

          {/* Showtimes Pill / Status */}
          <div className="mt-2.5 pt-2 border-t border-sbt-border/60">
            {isComingSoon ? (
              <div className="text-[11px] font-bold text-amber-400 tracking-wider">
                RELEASE: {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            ) : (
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Available Showtimes
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(movie.availableShowtimesList || ['10:30 AM', '02:20 PM', '06:20 PM', '10:15 PM'])
                    .slice(0, 4)
                    .map((time) => (
                      <span
                        key={time}
                        className="px-2 py-0.5 rounded text-[11px] font-bold bg-sbt-dark border border-sbt-border text-slate-200"
                      >
                        {time}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          {isComingSoon ? (
            <button
              onClick={() => navigate(`/movies/${movie.id}`)}
              className="w-full py-2.5 rounded-xl bg-sbt-cardHover hover:bg-sbt-border border border-amber-500/30 text-amber-300 text-xs font-bold transition-all text-center uppercase tracking-wider"
            >
              COMING SOON
            </button>
          ) : (
            <button
              onClick={() => navigate(`/movies/${movie.id}`)}
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-gradient-to-r from-sbt-pink to-rose-600 hover:from-sbt-pinkLight hover:to-rose-500 text-white text-xs font-extrabold shadow-md hover:shadow-glow-pink transition-all text-center tracking-wider"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>BOOK TICKETS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
