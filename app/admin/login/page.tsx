'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatusMsg('Authenticating passcode...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setStatusMsg('✓ Passcode accepted! Setting session cookie...');

      // Explicitly set cookie client-side as fail-safe fallback
      document.cookie = 'admin_session=authenticated; path=/; max-age=604800; SameSite=Lax';

      setStatusMsg('✓ Cookie saved. Redirecting to admin console...');

      setTimeout(() => {
        window.location.href = '/admin?auth=' + Date.now();
      }, 800);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Login failed');
      setStatusMsg('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-[#11141a]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-mono font-bold text-lg flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            AD
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-white">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Enter admin passcode to access portfolio console
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono text-center shadow-[0_0_10px_rgba(244,63,94,0.15)]">
            {error}
          </div>
        )}

        {statusMsg && !error && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="adminPasscode" className="block text-xs font-mono text-slate-300 uppercase tracking-widest">
              Admin Passcode
            </label>
            <input
              id="adminPasscode"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-hidden text-sm font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] disabled:opacity-50 font-mono cursor-pointer active:scale-95"
          >
            {loading ? 'Authenticating...' : 'Unlock Admin Console →'}
          </button>
        </form>

        <div className="pt-4 border-t border-white/[0.08] text-center">
          <a href="/" className="text-xs font-mono text-slate-400 hover:text-white transition-colors">
            ← Return to Public Portfolio
          </a>
        </div>

      </div>
    </div>
  );
}
