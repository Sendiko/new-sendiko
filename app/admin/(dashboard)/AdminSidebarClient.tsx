'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebarClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      document.cookie = 'admin_session=; path=/; max-age=0; SameSite=Lax';
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: '📊' },
    { name: 'Profile & Bio', href: '/admin/profile', icon: '👤' },
    { name: 'Projects & Work', href: '/admin/projects', icon: '📱' },
    { name: 'Skills & Tech Stack', href: '/admin/skills', icon: '⚡' },
    { name: 'Work Experience', href: '/admin/experiences', icon: '💼' },
    { name: 'Education', href: '/admin/education', icon: '🎓' },
    { name: 'Storage & Media', href: '/admin/storage', icon: '☁️' },
    { name: 'Messages & Inbox', href: '/admin/messages', icon: '📩' },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f8fafc] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0b0e14] text-white shrink-0 border-r border-white/[0.08] flex flex-col">
        {/* Header Branding */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              AD
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white font-sans">Admin Console</h2>
              <p className="text-[11px] font-mono text-slate-400">Portfolio CMS</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                    : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-xl text-xs font-mono transition-all border border-white/[0.08]"
          >
            <span>← View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-mono transition-all border border-rose-800/40 cursor-pointer"
          >
            <span>🔒 Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#08090a]">
        <header className="bg-[#0b0e14]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-20">
          <h1 className="font-bold text-lg text-white font-sans">
            {navItems.find((i) => i.href === pathname)?.name || 'Admin Console'}
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-mono text-emerald-400">Authenticated Session</span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>

    </div>
  );
}
