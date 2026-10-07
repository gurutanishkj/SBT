import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Smartphone,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Tag,
  CheckCircle2,
  MapPin,
  Clock,
  Ticket,
  ChevronRight,
  AlertCircle,
  Film,
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { FoodItem, Offer } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedMovie,
    selectedShow,
    selectedSeats,
    foodQuantities,
    updateFoodQuantity,
    appliedOffer,
    applyOffer,
    ticketTotal,
    convenienceFee,
    foodTotal,
    discountAmount,
    grandTotal,
    resetBooking,
  } = useBooking();

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET'>('UPI');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');

  // Redirect if no seats chosen
  useEffect(() => {
    if (selectedSeats.length === 0 || !selectedShow) {
      navigate('/showtimes');
    }
  }, [selectedSeats, selectedShow, navigate]);

  // Load food & offers
  useEffect(() => {
    async function loadAddons() {
      try {
        const [foodRes, offerRes] = await Promise.all([
          api.getFoodItems(),
          api.getOffers(),
        ]);
        if (foodRes.success) setFoodItems(foodRes.items);
        if (offerRes.success) setOffers(offerRes.offers);
      } catch (err) {
        console.error('Failed to load add-ons', err);
      }
    }
    loadAddons();
  }, []);

  const handleApplyPromo = (code: string) => {
    const matched = offers.find((o) => o.code.toUpperCase() === code.toUpperCase().trim());
    if (matched) {
      applyOffer(matched);
      setError(null);
    } else {
      setError('Invalid offer code');
    }
  };

  const handlePayNow = async () => {
    if (!user) {
      setError('Please sign in or create an account to finalize your booking.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Prepare food array payload
      const foodPayload = Object.entries(foodQuantities).map(([foodItemId, quantity]) => ({
        foodItemId,
        quantity,
      }));

      // Call transactional backend booking API
      const res = await api.createBooking({
        showId: selectedShow.id,
        seatIds: selectedSeats.map((s) => s.id),
        foodItems: foodPayload,
        paymentMethod: selectedPaymentMethod,
        convenienceFee,
      });

      if (res.success && res.booking) {
        // Simulated payment gateway confirmation
        setTimeout(() => {
          navigate(`/booking-success/${res.booking.id}`, { state: { booking: res.booking } });
        }, 1200);
      } else {
        throw new Error(res.error || 'Failed to complete booking');
      }
    } catch (err: any) {
      setError(err.message || 'Payment or seat reservation failed');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-sbt-gold border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            Securing Your Seats at SBT Kovilpatti...
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Acquiring transaction lock & generating official SBT ticket
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Food & Beverages + Payment Options */}
        <div className="lg:col-span-7 space-y-8">
          {/* Food & Beverages Section */}
          <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-sbt-border pb-4">
              <div>
                <span className="text-xs font-bold text-sbt-gold uppercase tracking-wider">
                  SBT Gourmet Lounge
                </span>
                <h2 className="text-xl font-black text-white uppercase">ADD FOOD & DRINKS</h2>
              </div>
              <span className="text-xs text-slate-400">Delivered directly to your seat</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foodItems.map((item) => {
                const qty = foodQuantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-3.5 rounded-2xl bg-sbt-dark border border-sbt-border hover:border-sbt-gold/40 transition-colors"
                  >
                    <div className="flex space-x-3 items-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                        <span className="text-xs font-black text-sbt-gold mt-1 block">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-sbt-border/60">
                      <span className="text-[10px] text-slate-400 font-medium">{item.category}</span>
                      <div className="flex items-center space-x-2 bg-sbt-card rounded-lg p-1 border border-sbt-border">
                        <button
                          onClick={() => updateFoodQuantity(item.id, -1)}
                          disabled={qty === 0}
                          className="w-6 h-6 rounded bg-sbt-dark flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{qty}</span>
                        <button
                          onClick={() => updateFoodQuantity(item.id, 1)}
                          className="w-6 h-6 rounded bg-sbt-gold text-sbt-dark flex items-center justify-center font-bold hover:bg-sbt-goldLight"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black text-white uppercase tracking-wide">
              SELECT PAYMENT METHOD (DEMO)
            </h3>
            <p className="text-xs text-slate-400">
              This is a demonstration sandbox. No real charges will be made.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('UPI')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${
                  selectedPaymentMethod === 'UPI'
                    ? 'bg-sbt-pink/15 border-sbt-pink text-white shadow-glow-pink'
                    : 'bg-sbt-dark border-sbt-border text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-5 h-5 text-sbt-pink" />
                <span className="text-xs font-bold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('CARD')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${
                  selectedPaymentMethod === 'CARD'
                    ? 'bg-sbt-pink/15 border-sbt-pink text-white shadow-glow-pink'
                    : 'bg-sbt-dark border-sbt-border text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-sbt-gold" />
                <span className="text-xs font-bold">Credit/Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('NET_BANKING')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${
                  selectedPaymentMethod === 'NET_BANKING'
                    ? 'bg-sbt-pink/15 border-sbt-pink text-white shadow-glow-pink'
                    : 'bg-sbt-dark border-sbt-border text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('WALLET')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${
                  selectedPaymentMethod === 'WALLET'
                    ? 'bg-sbt-pink/15 border-sbt-pink text-white shadow-glow-pink'
                    : 'bg-sbt-dark border-sbt-border text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Wallets</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
            {/* Header / Cinema Location */}
            <div className="border-b border-sbt-border pb-4 space-y-2">
              <span className="text-[10px] font-bold text-sbt-gold uppercase tracking-widest">
                BOOKING SUMMARY
              </span>
              <h3 className="text-xl font-black text-white uppercase tracking-wide">
                {selectedMovie?.title}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedMovie?.language} • {selectedMovie?.format || '2D'} • {selectedMovie?.certificate}
              </p>

              <div className="bg-sbt-dark/60 p-3 rounded-xl border border-sbt-border/60 text-xs space-y-1 mt-2">
                <p className="font-bold text-white">SATHYABAMA MULTIPLEX (SBT CINEMAS)</p>
                <p className="text-slate-400 text-[11px] leading-snug">
                  Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-2 text-slate-300">
                <span>{selectedShow?.date} • {selectedShow?.startTime}</span>
                <span className="text-sbt-gold">{selectedShow?.screen?.name || 'Screen 1'}</span>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Seats: </span>
                <strong className="text-sbt-pink text-sm font-black">
                  {selectedSeats.map((s) => s.seatCode).join(', ')}
                </strong>
              </div>
              <span className="text-slate-400">({selectedSeats.length} Tickets)</span>
            </div>

            {/* Offers & Promo Input */}
            <div className="space-y-2 pt-2 border-t border-sbt-border">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter Promo Code"
                    className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-3 py-2 pl-8 text-xs text-white uppercase font-bold focus:outline-none focus:border-sbt-gold"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyPromo(promoCodeInput)}
                  className="px-4 py-2 rounded-xl bg-sbt-gold text-sbt-dark text-xs font-bold uppercase hover:bg-sbt-goldLight"
                >
                  Apply
                </button>
              </div>

              {appliedOffer && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span>Offer Applied: {appliedOffer.code}</span>
                  <button onClick={() => applyOffer(null)} className="text-[10px] underline">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-sbt-border">
              <div className="flex justify-between">
                <span>Ticket Price ({selectedSeats.length} seats)</span>
                <span className="font-bold text-white">₹{ticketTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Convenience Fee & GST</span>
                <span className="font-bold text-white">₹{convenienceFee.toFixed(2)}</span>
              </div>

              {foodTotal > 0 && (
                <div className="flex justify-between">
                  <span>Food & Beverages</span>
                  <span className="font-bold text-white">₹{foodTotal.toFixed(2)}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Promo Discount</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-sbt-border">
                <span>Total Amount</span>
                <span className="text-sbt-gold text-lg">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* PROCEED TO PAY button */}
            <button
              onClick={handlePayNow}
              disabled={processing}
              className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl bg-gradient-to-r from-sbt-pink to-rose-600 hover:from-sbt-pinkLight hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider shadow-glow-pink transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <span>PROCEED TO PAY ₹{grandTotal.toFixed(2)}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
