import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { ShowtimesPage } from './pages/ShowtimesPage';
import { SeatSelectionPage } from './pages/SeatSelectionPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CinemasPage } from './pages/CinemasPage';
import { OffersPage } from './pages/OffersPage';
import { FoodDrinksPage } from './pages/FoodDrinksPage';
import { EventsPage } from './pages/EventsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-sbt-dark text-slate-100 selection:bg-sbt-pink selection:text-white">
      <ScrollToTop />
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/cinemas" element={<CinemasPage />} />
          <Route path="/showtimes" element={<ShowtimesPage />} />
          <Route path="/book/:showId" element={<SeatSelectionPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking-success/:bookingId" element={<BookingSuccessPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/food-drinks" element={<FoodDrinksPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default App;
