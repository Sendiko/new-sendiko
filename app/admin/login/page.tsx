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
    <div className="min-h-screen bg-[#091426] text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-2xl border border-gray-700 shadow-2xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#006591] text-[#ffffff] font-mono font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            AD
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Enter admin passcode to access portfolio console
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono text-center">
            {error}
          </div>
        )}

        {statusMsg && !error && (
          <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center">
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="adminPasscode" className="block text-xs font-mono text-gray-300 uppercase tracking-wide">
              Admin Passcode
            </label>
            <input
              id="adminPasscode"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#091426] border border-gray-700 text-white placeholder-gray-500 focus:border-[#006591] focus:ring-2 focus:ring-[#006591]/40 outline-hidden text-sm font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#006591] hover:bg-[#39b8fd] hover:text-[#091426] font-bold text-sm rounded-lg transition-all shadow-md disabled:opacity-50 font-mono cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Unlock Admin Console'}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-800 text-center">
          <a href="/" className="text-xs font-mono text-gray-400 hover:text-white transition-colors">
            ← Return to Public Portfolio
          </a>
        </div>

      </div>
    </div>
  );
}
