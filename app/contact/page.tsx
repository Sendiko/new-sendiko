import prisma from '@/lib/prisma';
import ContactForm from '@/components/ContactForm';

export const revalidate = 60;

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
          Direct Communication
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-sans text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Have an exciting mobile application project, consulting inquiry, or architectural code review requirement? Send a message directly.
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Column: Developer Information */}
        <div className="lg:col-span-5 space-y-8">

          <div className="bg-[#11141a]/90 backdrop-blur-md text-white p-8 rounded-2xl space-y-6 shadow-2xl border border-white/[0.08] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 blur-[60px] pointer-events-none rounded-full" />

            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center font-mono font-bold text-lg text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                RS
              </div>
              <div>
                <h3 className="text-xl font-bold font-sans text-white">{profile?.name || 'Rizky Sendiko'}</h3>
                <p className="text-xs text-sky-400 font-mono mt-0.5">Senior Mobile Architect</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed font-sans relative z-10">
              Specialized in native iOS (Swift / SwiftUI), Android (Kotlin / Jetpack Compose), and reactive cross-platform architecture.
            </p>

            <div className="pt-4 border-t border-white/[0.08] space-y-4 text-sm font-sans relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-sky-400 shrink-0 font-mono text-sm shadow-xs">
                  ✉
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-mono block">Direct Email</span>
                  <a href={`mailto:${profile?.email || 'contact@sendiko.dev'}`} className="text-white hover:text-sky-300 transition-colors font-medium">
                    {profile?.email || 'contact@sendiko.dev'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0 font-mono text-sm shadow-xs">
                  📍
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-mono block">Location</span>
                  <span className="text-white font-medium">{profile?.location || 'Bandung, Indonesia (UTC+7)'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-amber-300 shrink-0 font-mono text-sm shadow-xs">
                  ⚡
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-mono block">Response Time</span>
                  <span className="text-white font-medium">Within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3 relative z-10">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Social Network</span>
              <div className="flex flex-wrap gap-2.5 text-xs font-mono">
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] transition-all">
                    GitHub
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] transition-all">
                    LinkedIn
                  </a>
                )}
                {profile?.twitterUrl && (
                  <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] transition-all">
                    Twitter / X
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

      </div>

    </div>
  );
}
