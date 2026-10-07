import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Film, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MovieCard } from '../components/MovieCard';
import { api } from '../api/client';
import { Movie } from '../types';

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getFavorites();
        if (res.success) setFavorites(res.favorites);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Heart className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Sign In to View Favorites</h2>
        <p className="text-xs text-slate-400 mt-1">
          Keep track of movies you love and want to watch again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-8">
      <div className="border-b border-sbt-border pb-5">
        <span className="text-xs font-bold text-sbt-gold uppercase tracking-wider">
          Saved Films
        </span>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">MY FAVORITES</h1>
        <p className="text-xs text-slate-400 mt-0.5">Persisted in database for your profile</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-[2/3] bg-sbt-card rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 bg-sbt-card rounded-3xl border border-sbt-border p-8">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No favorites saved yet</h3>
          <p className="text-xs text-slate-400 mt-1">Click the heart on any movie poster to save it here.</p>
          <button
            onClick={() => navigate('/movies')}
            className="mt-5 px-6 py-2.5 rounded-xl bg-sbt-gold text-sbt-dark font-black text-xs uppercase"
          >
            Explore Movies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
};
