import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Shield, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminLogin({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFillDemo = () => {
    setEmail('admin@cosmic.com');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid credentials');
      }

      if (data.user.role !== 'ADMIN') {
        throw new Error('Access denied: User does not possess Maison Atelier credentials (ADMIN required).');
      }

      login(data.user, data.token);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your Maison credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden font-sans select-none">
      {/* Subtle Atmospheric Light Cone */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/10 via-white/2 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C0C0C0]/5 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Plaque */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] text-[#C0C0C0] mb-2">
            <Shield className="w-3 h-3 text-[#C0C0C0]" />
            Atelier Executive Portal
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-[0.2em] uppercase font-light">
            COSMIC
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#707070]">
            Maison Operations & Inventory Vault
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#080808]/90 border border-white/15 backdrop-blur-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C0C0C0]/60 to-transparent" />

          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs tracking-wide flex items-start gap-2 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
                Atelier Staff Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="directeur@cosmic.com"
                  required
                  className="w-full bg-[#111111] border border-white/15 px-4 py-3 pl-10 text-xs text-white placeholder-[#505050] outline-none focus:border-[#C0C0C0] transition-colors"
                />
                <Mail className="w-4 h-4 text-[#606060] absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
                Access Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#111111] border border-white/15 px-4 py-3 pl-10 text-xs text-white placeholder-[#505050] outline-none focus:border-[#C0C0C0] transition-colors font-mono"
                />
                <Lock className="w-4 h-4 text-[#606060] absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 chrome-button text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter Atelier</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Preset */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-[#A0A0A0] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C0C0C0]" />
              <span>Use Atelier Director Preset</span>
            </button>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-[#505050]">
          256-Bit Encrypted • Hardware Security Key Compatible
        </div>
      </div>
    </div>
  );
}
