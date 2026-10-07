import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Tv,
  Volume2,
  Car,
  Coffee,
  Sparkles,
  Ticket,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const CinemasPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-10">
      {/* Multiplex Header */}
      <div className="bg-gradient-to-r from-sbt-card via-[#161926] to-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-12 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sbt-gold/15 text-sbt-gold text-xs font-bold border border-sbt-gold/30">
          <MapPin className="w-3.5 h-3.5 text-sbt-pink" />
          <span>OFFICIAL CINEMA SPECIFICATIONS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          SATHYABAMA MULTIPLEX <br />
          <span className="text-gold-gradient">SBT CINEMAS</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          The premier motion-picture showcase in Kovilpatti, providing audiences with Barco 4K Laser Projection, 64-channel Dolby Atmos acoustics, gourmet in-seat snacking, and plush electric recliners.
        </p>

        <div className="bg-sbt-dark/70 p-4 rounded-2xl border border-sbt-border/80 max-w-2xl text-xs space-y-1.5">
          <p className="text-white font-bold text-sm">📍 Official Venue Address:</p>
          <p className="text-slate-300 leading-relaxed">
            Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-slate-400">
            <span className="flex items-center gap-1.5 text-sbt-gold font-semibold">
              <Phone className="w-3.5 h-3.5" /> +91 4632 220000
            </span>
            <span className="flex items-center gap-1.5 text-sbt-pink font-semibold">
              <Mail className="w-3.5 h-3.5" /> support@sbtcinemas.com
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('/showtimes')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sbt-pink to-rose-600 hover:from-sbt-pinkLight hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-glow-pink"
          >
            <Ticket className="w-4 h-4" />
            <span>SEE TODAY'S SHOWTIMES</span>
          </button>
        </div>
      </div>

      {/* Screen Technical Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Screen 1 */}
        <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-sbt-border pb-4">
            <div>
              <span className="text-[10px] font-bold text-sbt-gold uppercase tracking-widest">
                AUDITORIUM 1
              </span>
              <h3 className="text-xl font-black text-white uppercase">
                Screen 1 — 4K Dolby Atmos
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-sbt-gold/15 text-sbt-gold text-xs font-black">
              150 SEATS
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Our flagship auditorium with an ultra-wide silver screen, Barco 4K RGB laser projection, and high-impact Dolby Atmos multi-dimensional surround system.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Projection: Barco 4K Laser High Frame Rate</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sound: Dolby Atmos 64-Channel Surround</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Layout: Rows A to J (Classic, Premium, VIP Recliner)</span>
            </div>
          </div>
        </div>

        {/* Screen 2 */}
        <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-sbt-border pb-4">
            <div>
              <span className="text-[10px] font-bold text-sbt-pink uppercase tracking-widest">
                AUDITORIUM 2
              </span>
              <h3 className="text-xl font-black text-white uppercase">
                Screen 2 — Dolby 7.1
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-sbt-pink/15 text-sbt-pink text-xs font-black">
              120 SEATS
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Engineered for optimum intimacy and crisp acoustics. Features high-definition Christie projection paired with punchy Dolby 7.1 linear surround channel balance.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Projection: Christie Digital 2K/4K</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sound: Dolby 7.1 Linear Cinema Audio</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Layout: Rows A to H (Classic, Club, Recliner VIP)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Multiplex Amenities */}
      <div className="bg-sbt-card border border-sbt-border rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wide">
          OFFICIAL THEATRE FACILITIES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-sbt-dark border border-sbt-border flex items-start space-x-3">
            <Tv className="w-6 h-6 text-sbt-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">4K Laser Visuals</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Ultra high-dynamic color contrast</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sbt-dark border border-sbt-border flex items-start space-x-3">
            <Volume2 className="w-6 h-6 text-sbt-pink shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Dolby Atmos Audio</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Overhead & spatial 3D surround sound</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sbt-dark border border-sbt-border flex items-start space-x-3">
            <Car className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Spacious Parking</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Two & four wheeler parking on-site</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sbt-dark border border-sbt-border flex items-start space-x-3">
            <Coffee className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Gourmet Snacks</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Fresh salted & butter popcorn, nachos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
