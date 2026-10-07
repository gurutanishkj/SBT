import React from 'react';
import { Link } from 'react-router-dom';
import { Film, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, Volume2, Monitor } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050608] border-t border-sbt-border/80 pt-16 pb-24 lg:pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Cinema Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sbt-goldDark to-sbt-gold flex items-center justify-center shadow-glow-gold">
                <Film className="w-5 h-5 text-sbt-dark" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-wide">
                SBT <span className="text-sbt-gold">CINEMAS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sathyabama Multiplex is Kovilpatti’s premiere cinematic destination, bringing 4K Laser Projection, Dolby Atmos soundscapes, and ultra-luxurious recliner comfort.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded bg-sbt-card border border-sbt-border text-sbt-gold">
                <Monitor className="w-3 h-3" /> 4K Laser
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded bg-sbt-card border border-sbt-border text-sbt-pink">
                <Volume2 className="w-3 h-3" /> Dolby Atmos
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded bg-sbt-card border border-sbt-border text-emerald-400">
                <Sparkles className="w-3 h-3" /> Recliner VIP
              </span>
            </div>
          </div>

          {/* Col 2: Exact Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sbt-pink" /> Fixed Cinema Location
            </h4>
            <div className="text-xs space-y-2 leading-relaxed bg-sbt-card/50 p-3.5 rounded-xl border border-sbt-border/60">
              <p className="text-white font-bold">SATHYABAMA MULTIPLEX (SBT CINEMAS)</p>
              <p className="text-slate-300">
                Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India
              </p>
              <p className="text-[11px] text-sbt-gold font-semibold pt-1">
                📍 Kovilpatti, Thoothukudi District
              </p>
            </div>
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-sbt-gold" />
                <span>+91 4632 220000 / +91 98421 00001</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-sbt-pink" />
                <span>support@sbtcinemas.com</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/movies" className="hover:text-sbt-gold transition-colors">
                  Now Showing in Kovilpatti
                </Link>
              </li>
              <li>
                <Link to="/showtimes" className="hover:text-sbt-gold transition-colors">
                  Today's Showtimes
                </Link>
              </li>
              <li>
                <Link to="/cinemas" className="hover:text-sbt-gold transition-colors">
                  Multiplex Screens & Facilities
                </Link>
              </li>
              <li>
                <Link to="/food-drinks" className="hover:text-sbt-gold transition-colors">
                  SBT Gourmet Food & Snacks
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-sbt-gold transition-colors">
                  Exclusive Offers & Discounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Safe & Secure Booking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe & Certified
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official real-time online ticketing gateway for Sathyabama Multiplex. Instant QR-code digital ticket validation at gate check-in.
            </p>
            <div className="bg-sbt-card p-3 rounded-xl border border-sbt-border space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-white font-medium">
                <Clock className="w-3.5 h-3.5 text-sbt-gold" />
                <span>Box Office Hours</span>
              </div>
              <p className="text-[11px] text-slate-400">09:30 AM – 11:45 PM (Daily IST)</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sbt-border/60 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 space-y-4 sm:space-y-0">
          <p>
            © 2026 SBT CINEMAS (Sathyabama Multiplex, Kovilpatti). All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-slate-400">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Cancellation Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
