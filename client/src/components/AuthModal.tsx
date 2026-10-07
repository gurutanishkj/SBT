import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Check, ShieldCheck, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        await login(email, password);
        onClose();
      } else if (mode === 'SIGNUP') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register({ name, email, phone, password, confirmPassword });
        onClose();
      } else if (mode === 'FORGOT') {
        const res = await api.forgotPassword(email);
        setSuccessMsg(res.message || 'Reset link dispatched.');
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = () => {
    setEmail('guest@sbtcinemas.com');
    setPassword('Password123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@sbtcinemas.com');
    setPassword('Admin@SBT2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-sbt-card border border-sbt-border rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-sbt-dark transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sbt-goldDark to-sbt-gold shadow-glow-gold mb-2">
            <Film className="w-6 h-6 text-sbt-dark" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-wider">
            SBT <span className="text-sbt-gold">CINEMAS</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
            Sathyabama Multiplex Kovilpatti
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-sbt-border mb-6">
          <button
            onClick={() => {
              setMode('LOGIN');
              setError(null);
            }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              mode === 'LOGIN' ? 'text-sbt-gold border-sbt-gold' : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => {
              setMode('SIGNUP');
              setError(null);
            }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              mode === 'SIGNUP' ? 'text-sbt-gold border-sbt-gold' : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Alert feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Karthik Raja"
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-sbt-gold transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@example.com"
                className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-sbt-gold transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9842109876"
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-sbt-gold transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {mode !== 'FORGOT' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Password</label>
                {mode === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('FORGOT');
                      setError(null);
                    }}
                    className="text-[10px] text-sbt-gold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-sbt-gold transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {mode === 'SIGNUP' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-sbt-dark border border-sbt-border rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-sbt-gold transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sbt-pink to-rose-600 hover:from-sbt-pinkLight hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-glow-pink disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : mode === 'LOGIN' ? 'Sign In' : mode === 'SIGNUP' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Quick Demo Fill Buttons for Testing convenience */}
        <div className="mt-6 pt-5 border-t border-sbt-border space-y-2">
          <p className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider">
            Quick Demo Auto-fill:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillDemoUser}
              className="flex-1 py-1.5 rounded-lg bg-sbt-dark hover:bg-sbt-cardHover border border-sbt-border text-[11px] font-semibold text-slate-300 transition-colors"
            >
              Demo Patron
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex-1 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-semibold text-amber-300 transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
