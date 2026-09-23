'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ senderName: '', senderEmail: '', subject: '', message: '' });
    } catch (err: unknown) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#11141a]/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-2xl space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-bold font-sans text-white">
          Send a Message
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Direct communication pipeline directly to my inbox
        </p>
      </div>

      {status === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold">Message Dispatched!</p>
            <p className="text-xs text-emerald-400/80">Thank you for reaching out. I will get back to you within 24 hours.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm shadow-[0_0_15px_rgba(244,63,94,0.15)]">
          <p className="font-semibold">Submission Error</p>
          <p className="text-xs text-rose-400/80">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="senderName" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
            Your Name *
          </label>
          <input
            id="senderName"
            type="text"
            required
            value={formData.senderName}
            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-hidden text-sm font-sans transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="senderEmail" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
            Your Email *
          </label>
          <input
            id="senderEmail"
            type="email"
            required
            value={formData.senderEmail}
            onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-hidden text-sm font-sans transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="subject" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
          Subject *
        </label>
        <input
          id="subject"
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Project Inquiry / Mobile Architecture Consulting"
          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-hidden text-sm font-sans transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell me about your mobile project requirements, timeframe, and goals..."
          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 outline-hidden text-sm font-sans transition-all resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-mono font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        {status === 'submitting' ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Transmitting...</span>
          </>
        ) : (
          <span>Send Message →</span>
        )}
      </button>
    </form>
  );
}
