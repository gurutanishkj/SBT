import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Film, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { api } from '../api/client';
import { Seat } from '../types';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

export const SeatSelectionPage: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    setSelectedShow,
    setSelectedMovie,
    selectedSeats,
    toggleSeat,
    clearSeats,
    ticketTotal,
  } = useBooking();

  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState<any | null>(null);
  const [rowsData, setRowsData] = useState<{ [row: string]: Seat[] }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSeats() {
      if (!showId) return;
      try {
        setLoading(true);
        clearSeats();
        const res = await api.getShowSeats(showId);
        if (res.success) {
          setShowInfo(res.show);
          setSelectedShow(res.show);
          setSelectedMovie(res.show.movie);
          setRowsData(res.rows);
        } else {
          setError('Failed to fetch seat layout');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading seats');
      } finally {
        setLoading(false);
      }
    }
    loadSeats();
  }, [showId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 border-4 border-sbt-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Loading Real-Time Cinema Seats...
        </p>
      </div>
    );
  }

  if (error || !showInfo) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Seat Layout Unavailable</h2>
        <p className="text-xs text-slate-400 mt-1">{error || 'Could not find this showtime.'}</p>
        <button
          onClick={() => navigate('/showtimes')}
          className="mt-5 px-6 py-2.5 rounded-xl bg-sbt-gold text-sbt-dark font-bold text-xs"
        >
          Return to Showtimes
        </button>
      </div>
    );
  }

  const rowKeys = Object.keys(rowsData).sort();

  return (
    <div className="min-h-screen pb-36 pt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Navigation & Show Header */}
        <div className="flex items-center justify-between border-b border-sbt-border pb-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
              {showInfo.movie?.title}
            </h1>
            <p className="text-[11px] text-slate-400">
              {showInfo.theatre?.name} • <span className="text-sbt-gold font-bold">{showInfo.screen?.name}</span>
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-white">{showInfo.startTime}</div>
            <div className="text-[10px] text-slate-400">{showInfo.date}</div>
          </div>
        </div>

        {/* Cinematic Screen Glow */}
        <div className="relative my-8 text-center max-w-2xl mx-auto">
          <div className="h-2 w-full cinema-screen-curve bg-gradient-to-b from-sbt-gold via-sbt-gold/50 to-transparent" />
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-3">
            ALL EYES THIS WAY • SCREEN
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300 my-6 bg-sbt-card/60 p-3 rounded-2xl border border-sbt-border/60 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border border-slate-600 bg-sbt-dark" />
            <span className="text-[11px]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-sbt-pink border border-sbt-pink" />
            <span className="text-[11px] font-bold text-white">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-700 opacity-60" />
            <span className="text-[11px] text-slate-500">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border border-amber-500 bg-amber-500/10 text-amber-400 text-[8px] flex items-center justify-center font-bold">
              R
            </div>
            <span className="text-[11px] text-amber-400">Recliner VIP</span>
          </div>
        </div>

        {/* Seat Grid Layout */}
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[650px] max-w-4xl mx-auto space-y-3 bg-sbt-card/30 p-6 rounded-3xl border border-sbt-border/40">
            {rowKeys.map((rowName) => {
              const rowSeats = rowsData[rowName] || [];
              const tier = rowSeats[0]?.tier || 'CLASSIC';

              let tierLabel = 'Classic (₹150)';
              if (tier === 'PREMIUM') tierLabel = 'Premium Club (₹190)';
              if (tier === 'RECLINER') tierLabel = 'VIP Recliner (₹250)';

              return (
                <div key={rowName} className="space-y-1">
                  {/* Category Header if first of row tier */}
                  {(rowName === 'A' || rowName === 'F' || rowName === 'I') && (
                    <div className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-widest pt-3 pb-1 border-b border-sbt-border/30">
                      {tierLabel}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2">
                    {/* Left Row Indicator */}
                    <span className="w-6 text-center text-xs font-bold text-slate-400">
                      {rowName}
                    </span>

                    {/* Seats in row */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                        const isOccupied = seat.isOccupied;
                        const isRecliner = seat.tier === 'RECLINER';

                        return (
                          <button
                            key={seat.id}
                            disabled={isOccupied}
                            onClick={() => toggleSeat(seat)}
                            title={`${seat.seatCode} - ${seat.tier} (₹${seat.price})`}
                            className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                              isOccupied
                                ? 'bg-slate-800/80 text-slate-600 border border-slate-800 cursor-not-allowed'
                                : isSelected
                                ? 'bg-sbt-pink text-white font-extrabold shadow-glow-pink scale-110 border border-rose-400'
                                : isRecliner
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20'
                                : 'bg-sbt-dark text-slate-300 border border-sbt-border hover:border-sbt-gold hover:text-white'
                            }`}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Row Indicator */}
                    <span className="w-6 text-center text-xs font-bold text-slate-400">
                      {rowName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-sbt-card/95 backdrop-blur-lg border-t border-sbt-border py-4 px-4 sm:px-6 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Selected Seats ({selectedSeats.length})
              </span>
              <div className="text-sm font-black text-white">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((s) => s.seatCode).join(', ')
                ) : (
                  <span className="text-slate-500 font-normal text-xs">No seats selected</span>
                )}
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="pl-4 border-l border-sbt-border">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Ticket Total
                </span>
                <div className="text-base font-black text-sbt-gold">₹{ticketTotal.toFixed(2)}</div>
              </div>
            )}
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={() => navigate('/checkout')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sbt-pink to-rose-600 hover:from-sbt-pinkLight hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-glow-pink transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>PROCEED TO FOOD & CHECKOUT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
