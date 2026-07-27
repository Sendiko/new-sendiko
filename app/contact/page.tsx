import prisma from '@/lib/prisma';
import ContactForm from '@/components/ContactForm';

export const revalidate = 60;

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
          Direct Communication
        </span>
        <h1 className="text-4xl font-bold font-sans text-[#091426]">
          Get in Touch
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Have an exciting mobile application project, consulting inquiry, or architectural code review requirement? Send a message directly.
        </p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column: Developer Information */}
        <div className="lg:col-span-5 space-y-8">

          <div className="bg-[#091426] text-white p-8 rounded-xl space-y-6 shadow-md border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#006591] flex items-center justify-center font-mono font-bold text-lg text-white">
                RS
              </div>
              <div>
                <h3 className="text-xl font-bold font-sans">{profile?.name || 'Rizky Sendiko'}</h3>
                <p className="text-xs text-gray-400 font-mono">Senior Mobile Engineer</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed font-sans">
              Specialized in native iOS (Swift / SwiftUI), Android (Kotlin / Compose), and cross-platform Flutter solutions.
            </p>

            <div className="pt-4 border-t border-gray-800 space-y-4 text-sm font-sans">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-[#39b8fd] shrink-0 font-mono text-xs">
                  ✉
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-mono block">Direct Email</span>
                  <a href={`mailto:${profile?.email || 'contact@sendiko.dev'}`} className="text-white hover:text-[#39b8fd] transition-colors font-medium">
                    {profile?.email || 'contact@sendiko.dev'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-[#00a291] shrink-0 font-mono text-xs">
                  📍
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-mono block">Location</span>
                  <span className="text-white font-medium">{profile?.location || 'Bandung, Indonesia (UTC+7)'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-amber-400 shrink-0 font-mono text-xs">
                  ⚡
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-mono block">Response Time</span>
                  <span className="text-white font-medium">Within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-gray-800 space-y-2">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Social Profiles</span>
              <div className="flex gap-3 text-xs font-mono">
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors">
                    GitHub
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors">
                    LinkedIn
                  </a>
                )}
                {profile?.twitterUrl && (
                  <a href={profile.twitterUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors">
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
