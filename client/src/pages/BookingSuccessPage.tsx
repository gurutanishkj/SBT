import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket, Download, Home, MapPin, Film, Sparkles, Printer } from 'lucide-react';
import { api } from '../api/client';
import { Booking } from '../types';
import { DigitalTicketModal } from '../components/DigitalTicketModal';

export const BookingSuccessPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = useState<Booking | null>(
    (location.state as any)?.booking || null
  );
  const [loading, setLoading] = useState(!booking);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#E11D48', '#10B981', '#3B82F6'],
    });

    async function loadBooking() {
      if (!booking && bookingId) {
        try {
          const res = await api.getBookingDetails(bookingId);
          if (res.success) {
            setBooking(res.booking);
          }
        } catch (err) {
          console.error('Failed to load booking details', err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadBooking();
  }, [bookingId]);

  if (loading || !booking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sbt-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const seatCodes = booking.bookingSeats?.map((s) => s.seatCode).join(', ') || '';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-28 space-y-8">
      {/* Success Card */}
      <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sbt-gold via-sbt-pink to-sbt-gold" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            BOOKED SUCCESSFULLY!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Your seats are reserved at Sathyabama Multiplex, Kovilpatti.
          </p>
        </div>

        {/* Confirmation Details Card */}
        <div className="bg-sbt-dark/80 rounded-2xl p-6 border border-sbt-border text-left space-y-4">
          <div className="border-b border-sbt-border pb-3">
            <span className="text-[10px] font-bold text-sbt-gold uppercase tracking-wider">Movie</span>
            <h3 className="text-xl font-black text-white uppercase">{booking.show?.movie?.title}</h3>
            <p className="text-xs text-slate-400">
              {booking.show?.movie?.language} • {booking.show?.movie?.format || '2D'} • {booking.show?.movie?.certificate}
            </p>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cinema</span>
            <p className="font-bold text-white">SATHYABAMA MULTIPLEX (SBT CINEMAS)</p>
            <p className="text-slate-400 text-[11px]">
              Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-sbt-border/60">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Date</span>
              <p className="font-bold text-white mt-0.5">{booking.show?.date}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Time</span>
              <p className="font-bold text-sbt-gold mt-0.5">{booking.show?.startTime}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Screen</span>
              <p className="font-bold text-white mt-0.5">{booking.show?.screen?.name || 'Screen 1'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Seats</span>
              <p className="font-black text-sbt-pink mt-0.5">{seatCodes}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs border-t border-sbt-border/60">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Booking ID</span>
              <p className="font-mono font-bold text-white mt-0.5">{booking.bookingCode}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Transaction ID</span>
              <p className="font-mono font-bold text-white mt-0.5">
                {booking.payment?.transactionId || 'TXN-984210'}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Amount</span>
              <p className="font-black text-sbt-gold text-sm mt-0.5">₹{booking.totalAmount?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons: VIEW TICKET, DOWNLOAD TICKET, BACK TO HOME */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setTicketModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sbt-pink to-rose-600 hover:from-sbt-pinkLight hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-glow-pink transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>VIEW DIGITAL TICKET</span>
          </button>

          <button
            onClick={() => setTicketModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-sbt-dark hover:bg-sbt-cardHover border border-sbt-border text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Download className="w-4 h-4 text-sbt-gold" />
            <span>DOWNLOAD TICKET</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Home className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </button>
        </div>
      </div>

      {/* Digital Ticket Modal */}
      {ticketModalOpen && (
        <DigitalTicketModal
          booking={booking}
          onClose={() => setTicketModalOpen(false)}
        />
      )}
    </div>
  );
};
