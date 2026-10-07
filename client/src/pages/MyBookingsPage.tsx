import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Film, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../api/client';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { DigitalTicketModal } from '../components/DigitalTicketModal';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getUserBookings();
        if (res.success) {
          setBookings(res.bookings);
        }
      } catch (err) {
        console.error('Failed to load user bookings', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Ticket className="w-12 h-12 text-sbt-gold mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Sign In to View Bookings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Please log in to review your past tickets and active reservations.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sbt-border pb-5">
        <div>
          <span className="text-xs font-bold text-sbt-gold uppercase tracking-wider">
            Patron Account
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">MY BOOKINGS</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your verified ticket history for SATHYABAMA MULTIPLEX, Kovilpatti
          </p>
        </div>

        <span className="text-xs font-bold text-slate-400 bg-sbt-card px-3 py-1.5 rounded-xl border border-sbt-border self-start sm:self-auto">
          {bookings.length} Bookings Recorded
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-36 bg-sbt-card rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-sbt-card rounded-3xl border border-sbt-border p-8">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No bookings yet</h3>
          <p className="text-xs text-slate-400 mt-1">Book a show to see your tickets here.</p>
          <button
            onClick={() => navigate('/showtimes')}
            className="mt-5 px-6 py-2.5 rounded-xl bg-sbt-gold text-sbt-dark font-black text-xs uppercase"
          >
            Explore Showtimes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const seatCodes = b.bookingSeats?.map((s) => s.seatCode).join(', ');
            return (
              <div
                key={b.id}
                className="bg-sbt-card border border-sbt-border/80 hover:border-sbt-gold/40 rounded-3xl p-5 sm:p-6 shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase">
                      {b.status}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      ID: {b.bookingCode}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase tracking-wide">
                    {b.show?.movie?.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-sbt-gold" />
                      {b.show?.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-sbt-gold" />
                      {b.show?.startTime}
                    </span>
                    <span className="text-sbt-pink font-bold">Seats: {seatCodes}</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    SATHYABAMA MULTIPLEX • {b.show?.screen?.name || 'Screen 1'}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-sbt-border gap-2">
                  <span className="text-base font-black text-sbt-gold">
                    ₹{b.totalAmount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sbt-dark hover:bg-sbt-cardHover border border-sbt-border text-white text-xs font-bold transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5 text-sbt-pink" />
                    <span>View Digital Ticket</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <DigitalTicketModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};
