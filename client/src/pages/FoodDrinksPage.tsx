import React, { useEffect, useState } from 'react';
import { Coffee, Sparkles, Plus, Check } from 'lucide-react';
import { api } from '../api/client';
import { FoodItem } from '../types';

export const FoodDrinksPage: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFood() {
      try {
        const res = await api.getFoodItems();
        if (res.success) setItems(res.items);
      } catch (err) {
        console.error('Failed to load food items', err);
      } finally {
        setLoading(false);
      }
    }
    loadFood();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sbt-card via-[#181926] to-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-10 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
          <Coffee className="w-3.5 h-3.5" />
          <span>SBT GOURMET CAFE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          FOOD & BEVERAGES
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Freshly popped theater corn, warm cheesy nachos, crisp beverages, and sharing combos served fresh at SATHYABAMA MULTIPLEX (SBT CINEMAS), Kovilpatti.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-sbt-card rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-sbt-card border border-sbt-border/80 hover:border-sbt-gold/50 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-44 rounded-2xl object-cover"
                />
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white uppercase">{item.name}</h3>
                  <span className="text-base font-black text-sbt-gold">₹{item.price}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-sbt-border/60 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-md bg-sbt-dark border border-sbt-border text-slate-400 font-semibold">
                  {item.category}
                </span>
                <span className="text-sbt-pink font-bold">Add during ticket checkout</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
