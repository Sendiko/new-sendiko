'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Skills & Experience', href: '/skills' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#08090a]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#11141a] text-white flex items-center justify-center font-mono font-bold text-base border border-white/10 group-hover:border-sky-400/50 group-hover:shadow-[0_0_16px_rgba(56,189,248,0.25)] transition-all duration-300">
            RS
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight text-base font-sans group-hover:text-sky-400 transition-colors">
              Rizky Sendiko
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Mobile Architect
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-[#11141a]/60 p-1 rounded-xl border border-white/[0.06]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-xs font-semibold border border-white/15'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-mono font-semibold px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] active:scale-95"
          >
            <span>Get in Touch</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
