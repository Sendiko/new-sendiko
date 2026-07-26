'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    // Check for admin_session cookie
    const hasAdminCookie = document.cookie
      .split('; ')
      .some((row) => row.startsWith('admin_session=authenticated'));

    if (!hasAdminCookie) {
      router.replace('/admin/login');
    } else {
      setCheckingAuth(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  // If rendering the login page, render children directly without admin sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#091426] text-white flex items-center justify-center font-mono text-sm">
        Verifying admin authentication...
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: '📊' },
    { name: 'Profile & Bio', href: '/admin/profile', icon: '👤' },
    { name: 'Projects & Work', href: '/admin/projects', icon: '📱' },
    { name: 'Skills & Tech Stack', href: '/admin/skills', icon: '⚡' },
    { name: 'Work Experience', href: '/admin/experiences', icon: '💼' },
    { name: 'Education', href: '/admin/education', icon: '🎓' },
    { name: 'Messages & Inbox', href: '/admin/messages', icon: '📩' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#091426] text-white shrink-0 border-r border-gray-800 flex flex-col">
        {/* Header Branding */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#006591] text-white flex items-center justify-center font-mono font-bold text-base shadow-xs">
              AD
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white font-sans">Admin Console</h2>
              <p className="text-[11px] font-mono text-gray-400">Portfolio CMS</p>
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[#006591] text-white font-bold shadow-xs'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono transition-all border border-white/10"
          >
            <span>← View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-lg text-xs font-mono transition-all border border-rose-800/50"
          >
            <span>🔒 Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-[#e0e3e5] px-6 py-4 flex items-center justify-between shadow-xs">
          <h1 className="font-bold text-lg text-[#091426] font-sans">
            {navItems.find((i) => i.href === pathname)?.name || 'Admin Console'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-gray-500">Authenticated Session</span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>

    </div>
  );
}
