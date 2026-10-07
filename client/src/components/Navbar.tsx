import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, MapPin, Search, User as UserIcon, X, Menu, Ticket, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>({ movies: [], cinemas: [], showtimes: [] });
  const [searching, setSearching] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search debounced
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ movies: [], cinemas: [], showtimes: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.search(searchQuery);
        if (res.success) {
          setSearchResults(res.results);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'MOVIES', path: '/movies' },
    { label: 'CINEMAS', path: '/cinemas' },
    { label: 'SHOWTIMES', path: '/showtimes' },
    { label: 'OFFERS', path: '/offers' },
    { label: 'FOOD & DRINKS', path: '/food-drinks' },
    { label: 'EVENTS', path: '/events' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-sbt-dark/95 backdrop-blur-md border-b border-sbt-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Logo */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sbt-goldDark to-sbt-gold flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform">
                  <Film className="w-6 h-6 text-sbt-dark font-black" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl tracking-wider text-white flex items-center gap-1.5">
                    SBT <span className="text-sbt-gold">CINEMAS</span>
                  </span>
                  <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase -mt-1">
                    Sathyabama Multiplex
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold tracking-wider">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className={`transition-colors py-1 border-b-2 ${
                        isActive
                          ? 'text-sbt-gold border-sbt-gold'
                          : 'text-slate-300 hover:text-white border-transparent hover:border-sbt-gold/40'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side: Location, Search, Auth, CTA */}
            <div className="flex items-center space-x-4">
              {/* Permanent Location: Kovilpatti (NO selector, NO GPS) */}
              <div
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-sbt-card border border-sbt-border text-slate-200 text-xs font-semibold shadow-inner"
                title="SBT CINEMAS is permanently located in Kovilpatti"
              >
                <MapPin className="w-3.5 h-3.5 text-sbt-pink animate-pulse" />
                <span className="text-white font-bold tracking-wide">📍 Kovilpatti</span>
              </div>

              {/* Search Toggle */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 rounded-xl bg-sbt-card hover:bg-sbt-cardHover border border-sbt-border text-slate-300 hover:text-sbt-gold transition-all"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Search Dropdown Modal */}
                {searchOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-sbt-card border border-sbt-border rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="relative">
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Movies, Shows, SBT..."
                        className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-sbt-gold transition-colors"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Results list */}
                    <div className="mt-3 max-h-80 overflow-y-auto space-y-3">
                      {searching && (
                        <div className="text-center py-4 text-xs text-slate-400">Searching database...</div>
                      )}

                      {!searching && searchQuery && searchResults.movies?.length === 0 && searchResults.cinemas?.length === 0 && searchResults.showtimes?.length === 0 && (
                        <div className="text-center py-4 text-xs text-slate-400">
                          No results found for "{searchQuery}".
                        </div>
                      )}

                      {/* Movies results */}
                      {searchResults.movies?.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-sbt-gold uppercase tracking-wider mb-1.5">Movies</div>
                          <div className="space-y-1.5">
                            {searchResults.movies.map((m: any) => (
                              <div
                                key={m.id}
                                onClick={() => {
                                  setSearchOpen(false);
                                  navigate(`/movies/${m.id}`);
                                }}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sbt-dark cursor-pointer transition-colors"
                              >
                                <img src={m.posterUrl} alt={m.title} className="w-9 h-12 rounded object-cover" />
                                <div>
                                  <div className="text-xs font-bold text-white hover:text-sbt-gold">{m.title}</div>
                                  <div className="text-[10px] text-slate-400">{m.language} • {m.genre}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cinemas results */}
                      {searchResults.cinemas?.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-sbt-gold uppercase tracking-wider mb-1.5">Cinemas</div>
                          <div className="space-y-1.5">
                            {searchResults.cinemas.map((c: any) => (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setSearchOpen(false);
                                  navigate('/cinemas');
                                }}
                                className="p-2 rounded-lg hover:bg-sbt-dark cursor-pointer transition-colors"
                              >
                                <div className="text-xs font-bold text-white">{c.name}</div>
                                <div className="text-[10px] text-slate-400 truncate">{c.address}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Showtimes results */}
                      {searchResults.showtimes?.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-sbt-gold uppercase tracking-wider mb-1.5">Showtimes</div>
                          <div className="space-y-1.5">
                            {searchResults.showtimes.map((s: any) => (
                              <div
                                key={s.id}
                                onClick={() => {
                                  setSearchOpen(false);
                                  navigate(`/book/${s.id}`);
                                }}
                                className="flex justify-between items-center p-2 rounded-lg hover:bg-sbt-dark cursor-pointer transition-colors"
                              >
                                <div>
                                  <div className="text-xs font-bold text-white">{s.movieTitle}</div>
                                  <div className="text-[10px] text-slate-400">{s.screenName} • {s.date}</div>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-sbt-gold/20 text-sbt-gold text-xs font-bold">
                                  {s.startTime}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Account / Auth */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <div>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-sbt-card hover:bg-sbt-cardHover border border-sbt-border text-sm font-semibold text-white transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-sbt-gold/20 border border-sbt-gold/40 flex items-center justify-center text-sbt-gold text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-xs">{user.name.split(' ')[0]}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-sbt-card border border-sbt-border rounded-2xl shadow-2xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-sbt-border">
                          <p className="text-xs font-bold text-white">{user.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                          {user.role === 'ADMIN' && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                              ADMINISTRATOR
                            </span>
                          )}
                        </div>

                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs text-amber-300 hover:bg-sbt-dark"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/my-bookings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-sbt-dark"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>My Bookings</span>
                        </Link>

                        <Link
                          to="/favorites"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-200 hover:bg-sbt-dark"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Favorites</span>
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-sbt-dark transition-colors border-t border-sbt-border mt-1"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-sbt-card hover:bg-sbt-cardHover border border-sbt-border text-xs font-bold text-white transition-all"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-sbt-gold" />
                    <span>LOGIN</span>
                  </button>
                )}
              </div>

              {/* BOOK TICKETS quick CTA */}
              <Link
                to="/showtimes"
                className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sbt-pink to-rose-600 hover:from-sbt-pinkLight hover:to-rose-500 text-white text-xs font-extrabold shadow-glow-pink tracking-wider transition-all transform hover:-translate-y-0.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>BOOK TICKETS</span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-sbt-card text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-sbt-card border-b border-sbt-border px-4 pt-2 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-bold text-slate-200 hover:bg-sbt-dark hover:text-sbt-gold"
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-bold text-amber-400 hover:bg-sbt-dark"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
            <div className="pt-2 border-t border-sbt-border">
              <Link
                to="/showtimes"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-sbt-pink text-white text-xs font-bold shadow-glow-pink"
              >
                <Ticket className="w-4 h-4" />
                <span>BOOK TICKETS NOW</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sbt-card/95 backdrop-blur-lg border-t border-sbt-border flex justify-around items-center py-2 px-3 text-[10px] font-semibold">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/' ? 'text-sbt-gold' : 'text-slate-400'}`}
        >
          <Film className="w-5 h-5" />
          <span>HOME</span>
        </Link>
        <Link
          to="/movies"
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/movies' ? 'text-sbt-gold' : 'text-slate-400'}`}
        >
          <Film className="w-5 h-5" />
          <span>MOVIES</span>
        </Link>
        <Link
          to="/showtimes"
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/showtimes' ? 'text-sbt-pink font-bold' : 'text-slate-400'}`}
        >
          <Ticket className="w-5 h-5" />
          <span>TICKETS</span>
        </Link>
        <Link
          to={user ? '/my-bookings' : '#'}
          onClick={() => {
            if (!user) onOpenAuth();
          }}
          className={`flex flex-col items-center space-y-1 ${location.pathname === '/my-bookings' ? 'text-sbt-gold' : 'text-slate-400'}`}
        >
          <UserIcon className="w-5 h-5" />
          <span>PROFILE</span>
        </Link>
      </nav>
    </>
  );
};
