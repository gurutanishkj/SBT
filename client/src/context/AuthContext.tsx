import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Movie } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  favorites: Movie[];
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isFavorite: (movieId: string) => boolean;
  toggleFavorite: (movie: Movie) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sbt_token'));
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Load user profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getMe();
        if (data.success) {
          setUser(data.user);
          loadFavorites();
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  async function loadFavorites() {
    try {
      const data = await api.getFavorites();
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch {
      // Ignore
    }
  }

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    if (data.success) {
      localStorage.setItem('sbt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      loadFavorites();
    }
  };

  const register = async (formData: any) => {
    const data = await api.register(formData);
    if (data.success) {
      localStorage.setItem('sbt_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('sbt_token');
    setToken(null);
    setUser(null);
    setFavorites([]);
  };

  const isFavorite = (movieId: string) => {
    return favorites.some((f) => f.id === movieId);
  };

  const toggleFavorite = async (movie: Movie) => {
    if (!user) {
      // If not logged in, trigger demo toast or fallback state
      return;
    }
    try {
      if (isFavorite(movie.id)) {
        await api.removeFavorite(movie.id);
        setFavorites((prev) => prev.filter((f) => f.id !== movie.id));
      } else {
        await api.addFavorite(movie.id);
        setFavorites((prev) => [...prev, movie]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        favorites,
        login,
        register,
        logout,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
