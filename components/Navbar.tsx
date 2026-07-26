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
    <header className="sticky top-0 z-50 glass-panel border-b border-[#e0e3e5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#091426] text-white flex items-center justify-center font-mono font-bold text-lg shadow-md group-hover:bg-[#006591] transition-colors">
            RS
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 tracking-tight text-base font-sans group-hover:text-[#006591] transition-colors">
              Rizky Sendiko
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Mobile Architect
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#091426] text-white shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
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
            className="inline-flex items-center gap-2 bg-[#006591] hover:bg-[#004c6e] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md active:translate-y-0.5"
          >
            <span>Get in Touch</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
