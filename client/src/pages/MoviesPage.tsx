import React, { useEffect, useState } from 'react';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../types';
import { api } from '../api/client';
import { Film, Search, Filter, Sparkles, MapPin } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NOW_SHOWING' | 'COMING_SOON'>('NOW_SHOWING');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        if (activeTab === 'NOW_SHOWING') {
          const res = await api.getNowShowing();
          if (res.success) setMovies(res.movies);
        } else {
          const res = await api.getUpcoming();
          if (res.success) setMovies(res.movies);
        }
      } catch (err) {
        console.error('Failed to load movies', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [activeTab]);

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.toLowerCase().includes(search.toLowerCase());
    const matchesLang =
      selectedLanguage === 'ALL' || m.language.toLowerCase().includes(selectedLanguage.toLowerCase());
    return matchesSearch && matchesLang;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sbt-card via-[#161824] to-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sbt-pink/15 text-sbt-pink text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>EXCLUSIVELY AT KOVILPATTI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            DISCOVER MOVIES
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Current real-time theatrical listings and upcoming major blockbusters at SATHYABAMA MULTIPLEX (SBT CINEMAS), Kovilpatti.
          </p>
        </div>
      </div>

      {/* Tabs and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-sbt-card p-4 rounded-2xl border border-sbt-border">
        {/* Switch Tabs */}
        <div className="flex items-center bg-sbt-dark p-1 rounded-xl border border-sbt-border self-start">
          <button
            onClick={() => setActiveTab('NOW_SHOWING')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'NOW_SHOWING'
                ? 'bg-sbt-gold text-sbt-dark shadow-glow-gold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => setActiveTab('COMING_SOON')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'COMING_SOON'
                ? 'bg-sbt-gold text-sbt-dark shadow-glow-gold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Coming Soon
          </button>
        </div>

        {/* Search & Language Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, genre..."
              className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-4 py-2 pl-9 text-xs text-white focus:outline-none focus:border-sbt-gold"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sbt-gold"
          >
            <option value="ALL">All Languages</option>
            <option value="Tamil">Tamil</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-[2/3] bg-sbt-card rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-16 bg-sbt-card rounded-2xl border border-sbt-border p-8">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No movies found</h3>
          <p className="text-xs text-slate-400 mt-1">Try refining your search term or language filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
