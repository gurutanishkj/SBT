import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sparkles, MapPin, Ticket, Flame, Trophy } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();

  const events = [
    {
      id: '1',
      title: 'Midnight Mass Fan Fest: Baththa',
      date: 'OCTOBER 10, 2026 • 10:15 PM',
      description: 'Exclusive fan roar screening with special lighting, Dolby Atmos bass boosters, and free welcome theater combo.',
      badge: 'FAN SPECIAL',
      screen: 'Screen 1 - 4K Dolby Atmos',
    },
    {
      id: '2',
      title: 'Weekend Cinephile Marathon',
      date: 'SATURDAY & SUNDAY • SPECIAL SLOTS',
      description: 'Back-to-back screenings of Yezhu Kadal Yezhu Malai & Meesaya Murukku 2 with discounted combo vouchers.',
      badge: 'DOUBLE FEATURE',
      screen: 'Screen 2 - Dolby 7.1',
    },
    {
      id: '3',
      title: 'Avengers: Doomsday Midnight Premiere Launch',
      date: 'DECEMBER 18, 2026 • 12:01 AM',
      description: 'Grand midnight premiere booking waitlist opening soon. Witness Doctor Doom’s ascent on Kovilpatti’s biggest 4K screen.',
      badge: 'UPCOMING PREMIERE',
      screen: 'Screen 1 - 4K Dolby Atmos',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sbt-card via-[#171926] to-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-10 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sbt-pink/15 text-sbt-pink text-xs font-bold border border-sbt-pink/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KOVILPATTI SPECIAL SCREENINGS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          CINEMA EVENTS & FAN EXPERIENCES
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Exclusive fan clubs, festival midnight screenings, and premiere galas at SATHYABAMA MULTIPLEX (SBT CINEMAS), Kovilpatti.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-sbt-card border border-sbt-border hover:border-sbt-gold/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all transform hover:-translate-y-1"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-xl bg-sbt-gold/15 text-sbt-gold text-xs font-black inline-block">
                {evt.badge}
              </span>
              <h3 className="text-lg font-black text-white uppercase">{evt.title}</h3>
              <p className="text-xs font-bold text-sbt-pink flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {evt.date}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
            </div>

            <div className="pt-3 border-t border-sbt-border/60">
              <span className="text-[11px] text-slate-400 block mb-3 font-semibold">
                📍 {evt.screen}
              </span>
              <button
                onClick={() => navigate('/showtimes')}
                className="w-full py-2.5 rounded-xl bg-sbt-dark hover:bg-sbt-cardHover border border-sbt-border text-white text-xs font-bold uppercase transition-colors"
              >
                Check Showtimes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
