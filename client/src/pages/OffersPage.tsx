import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Sparkles, Copy, Check, Ticket, Clock, Percent } from 'lucide-react';
import { api } from '../api/client';
import { Offer } from '../types';

export const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await api.getOffers();
        if (res.success) setOffers(res.offers);
      } catch (err) {
        console.error('Failed to load offers', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sbt-card via-[#181926] to-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-10 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sbt-gold/15 text-sbt-gold text-xs font-bold border border-sbt-gold/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EXCLUSIVE PROMOTIONS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          OFFERS & DISCOUNTS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Save on movie tickets, VIP seating, and gourmet popcorn combos at SATHYABAMA MULTIPLEX (SBT CINEMAS), Kovilpatti.
        </p>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 bg-sbt-card rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-sbt-card border border-sbt-border/80 hover:border-sbt-gold/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 transition-all transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-sbt-pink/15 text-sbt-pink text-xs font-extrabold flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" />
                    {offer.discountType === 'FLAT' ? `Flat ₹${offer.discountValue} OFF` : `${offer.discountValue}% OFF`}
                  </span>

                  <span className="text-[11px] text-slate-400 font-semibold">
                    Min Order: ₹{offer.minAmount}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                  {offer.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              {/* Promo Code Strip & Action */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-sbt-dark border border-sbt-border">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-sbt-gold" />
                  <span className="font-mono text-sm font-black text-white tracking-wider">
                    {offer.code}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sbt-card hover:bg-sbt-cardHover border border-sbt-border text-xs font-bold text-slate-200 hover:text-white transition-colors"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
