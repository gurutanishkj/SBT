import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Printer, CheckCircle2, MapPin, Film, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';

interface DigitalTicketModalProps {
  booking: Booking;
  onClose: () => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({ booking, onClose }) => {
  const qrData = JSON.stringify({
    bookingCode: booking.bookingCode,
    movie: booking.show?.movie?.title,
    date: booking.show?.date,
    time: booking.show?.startTime,
    seats: booking.bookingSeats?.map((s) => s.seatCode).join(','),
    cinema: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
    kovilpatti: true,
  });

  const seatCodes = booking.bookingSeats?.map((s) => s.seatCode).join(', ') || 'Seats Reserved';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-sbt-card border border-sbt-gold/40 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-sbt-dark via-[#1a1b26] to-sbt-dark p-6 border-b border-sbt-border/80 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-sbt-dark/60 text-slate-400 hover:text-white hover:bg-sbt-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CONFIRMED BOOKING</span>
          </div>

          <div className="flex items-center justify-center space-x-2 text-white">
            <Film className="w-5 h-5 text-sbt-gold" />
            <h2 className="text-xl font-black tracking-wider">
              SBT <span className="text-sbt-gold">CINEMAS</span>
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            Sathyabama Multiplex
          </p>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center justify-between px-2 bg-sbt-card">
          <div className="w-5 h-5 rounded-full bg-black -ml-5 shadow-inner" />
          <div className="flex-1 border-b-2 border-dashed border-sbt-border/80 mx-2" />
          <div className="w-5 h-5 rounded-full bg-black -mr-5 shadow-inner" />
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Movie Details */}
          <div>
            <div className="text-[10px] font-bold text-sbt-gold uppercase tracking-wider">Movie</div>
            <h3 className="text-xl font-extrabold text-white tracking-wide uppercase">
              {booking.show?.movie?.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {booking.show?.movie?.language} • {booking.show?.movie?.format || '2D'} • {booking.show?.movie?.certificate}
            </p>
          </div>

          {/* Cinema & Address */}
          <div className="bg-sbt-dark/60 p-3 rounded-xl border border-sbt-border/60">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-sbt-pink shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">SATHYABAMA MULTIPLEX (SBT CINEMAS)</p>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India
                </p>
              </div>
            </div>
          </div>

          {/* Grid of Show Details */}
          <div className="grid grid-cols-2 gap-4 bg-sbt-dark/40 p-4 rounded-2xl border border-sbt-border/60">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
              <p className="text-xs font-bold text-white">{booking.show?.date}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
              <p className="text-xs font-bold text-sbt-gold">{booking.show?.startTime}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Screen</span>
              <p className="text-xs font-bold text-white truncate">{booking.show?.screen?.name || 'Screen 1'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seats</span>
              <p className="text-xs font-black text-sbt-pink tracking-wider">{seatCodes}</p>
            </div>
          </div>

          {/* Codes & Payment Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Booking ID</span>
              <p className="font-mono font-bold text-white tracking-wide">{booking.bookingCode}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Transaction ID</span>
              <p className="font-mono font-bold text-white tracking-wide">
                {booking.payment?.transactionId || 'TXN-984210'}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-sbt-border/80">
            <span className="text-xs font-bold text-slate-300">Total Paid (Demo)</span>
            <span className="text-lg font-black text-sbt-gold">₹{booking.totalAmount?.toFixed(2)}</span>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-sbt-dark space-y-2 shadow-inner">
            <QRCodeSVG value={qrData} size={130} level="H" includeMargin={false} />
            <p className="text-[10px] font-extrabold tracking-widest text-slate-600 uppercase">
              Scan at SBT Kovilpatti Gate
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-sbt-dark border-t border-sbt-border flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-sbt-card hover:bg-sbt-cardHover border border-sbt-border text-xs font-bold text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-sbt-gold" />
            <span>PRINT / SAVE</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-sbt-pink hover:bg-sbt-pinkLight text-white text-xs font-extrabold tracking-wider transition-colors shadow-glow-pink text-center"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
