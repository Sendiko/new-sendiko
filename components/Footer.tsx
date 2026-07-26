import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#091426] text-white pt-12 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          
          {/* Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006591] text-white flex items-center justify-center font-mono font-bold text-base">
                RS
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Rizky Sendiko
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Senior Mobile Software Engineer crafting high-performance iOS, Android, and Flutter applications with scalable Clean Architecture.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Available for Mobile Engineering Roles
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-white transition-colors">
                  Projects & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-gray-300 hover:text-white transition-colors">
                  Skills & Experience
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">
              Connect
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-gray-300">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-2 transition-colors"
              >
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-2 transition-colors"
              >
                <span>LinkedIn</span>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-2 transition-colors"
              >
                <span>Twitter / X</span>
              </a>
              <a
                href="mailto:contact@sendiko.dev"
                className="hover:text-white flex items-center gap-2 transition-colors text-[#39b8fd]"
              >
                <span>contact@sendiko.dev</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Rizky Sendiko. All rights reserved.</p>
          <div className="flex items-center gap-4 font-mono">
            <span>Built with Next.js 16 & Prisma</span>
            <span>•</span>
            <span>Indigo Precision System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
