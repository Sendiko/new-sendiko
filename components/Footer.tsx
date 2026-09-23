import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function Footer() {
  const profile = await prisma.profile.findFirst();

  const getInitials = (name?: string) => {
    if (!name) return 'RS';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <footer className="bg-[#050608] text-white pt-14 pb-10 border-t border-white/[0.08] mt-auto relative overflow-hidden">
      {/* Subtle background ambient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          
          {/* Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#11141a] text-white flex items-center justify-center font-mono font-bold text-sm border border-white/10 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
                {getInitials(profile?.name)}
              </div>
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                {profile?.name || 'Rizky Sendiko'}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {profile?.bio ||
                'Senior Mobile Software Engineer crafting high-performance iOS, Android, and Flutter applications with scalable Clean Architecture.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {profile?.availableForHire !== false
                ? 'Available for Mobile Engineering Roles'
                : 'Not Currently Available for Hire'}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-white transition-colors">
                  Projects & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-slate-400 hover:text-white transition-colors">
                  Skills & Experience
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Connect
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-slate-400">
              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-2 transition-colors"
                >
                  <span>GitHub</span>
                </a>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-2 transition-colors"
                >
                  <span>LinkedIn</span>
                </a>
              )}
              {profile?.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-2 transition-colors"
                >
                  <span>Twitter / X</span>
                </a>
              )}
              <a
                href={`mailto:${profile?.email || 'contact@sendiko.dev'}`}
                className="hover:text-sky-300 flex items-center gap-2 transition-colors text-sky-400 font-mono text-xs"
              >
                <span>{profile?.email || 'contact@sendiko.dev'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {profile?.name || 'Rizky Sendiko'}. All rights reserved.</p>
          <div className="flex items-center gap-3 font-mono">
            <span>Built with Next.js 16 & Prisma</span>
            <span className="text-slate-700">•</span>
            <span className="text-sky-400/80">Obsidian Sleek System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
