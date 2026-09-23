import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProjectCard from '@/components/ProjectCard';
import SkillCard from '@/components/SkillCard';

export const revalidate = 60;

export default async function HomePage() {
  const profile = await prisma.profile.findFirst();

  const featuredProjects = await prisma.project.findMany({
    where: { featured: true },
    take: 3,
    orderBy: { featuredOrder: 'asc' },
    include: {
      skills: {
        include: { skill: true },
      },
    },
  });

  const skillCategories = await prisma.skillCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      skills: {
        orderBy: { order: 'asc' },
      },
    },
  });

  const experiences = await prisma.workExperience.findMany({
    orderBy: { startDate: 'desc' },
  });

  const educations = await prisma.education.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-24 pb-24">

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
        {/* Ambient background glow light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute -top-24 left-10 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Left Intro */}
            <div className="lg:col-span-8 space-y-6">

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span>{profile?.availableForHire !== false ? 'Available for New Opportunities' : 'Focusing on Current Architecture'}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-sans tracking-tight leading-[1.08] text-white">
                {profile?.headline ? (
                  profile.headline
                ) : (
                  <>
                    Engineering Resilient{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">
                      Mobile Experiences
                    </span>
                  </>
                )}
              </h1>

              <p className="text-slate-400 text-lg sm:text-xl max-w-2xl leading-relaxed font-sans">
                {profile?.bio || 'Building resilient, high-speed mobile applications with SwiftUI, Jetpack Compose, and Clean Architecture.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-mono font-semibold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45)] flex items-center gap-2 active:scale-95"
                >
                  <span>Explore Case Studies</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono font-semibold rounded-xl text-xs uppercase tracking-wider transition-all border border-white/10 hover:border-white/25 active:scale-95"
                >
                  Contact Developer
                </Link>
              </div>
            </div>

            {/* Hero Right Avatar / Stats */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-white/20 via-sky-500/20 to-transparent shadow-[0_0_50px_rgba(56,189,248,0.15)] w-full max-w-sm">
                <div className="bg-[#11141a]/95 backdrop-blur-xl p-8 rounded-[23px] text-center space-y-6">
                  <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    {/* eslint-disable-next-google/no-img-element */}
                    <img
                      src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600'}
                      alt={profile?.name || 'Rizky Sendiko'}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-sans">{profile?.name || 'Rizky Sendiko'}</h3>
                    <p className="text-xs text-sky-400 font-mono mt-1">{profile?.location || 'Bandung, Indonesia'}</p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex justify-around text-center">
                    <div>
                      <div className="text-2xl font-bold text-white font-mono">
                        {profile?.yearsExperience || 5}+ Yrs
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Experience</div>
                    </div>
                    <div className="w-[1px] bg-white/[0.08] h-10" />
                    <div>
                      <div className="text-2xl font-bold text-emerald-400 font-mono">
                        {profile?.appsPublished || 12}+
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Apps Built</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Core Skill Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              Technical Competencies
            </span>
            <h2 className="text-3xl font-bold font-sans text-white mt-1">
              Technology Stack & Architecture
            </h2>
          </div>
          <Link
            href="/skills"
            className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Technologies →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat) => (
            <div key={cat.id} className="space-y-4 bg-[#11141a]/80 backdrop-blur-md p-5 rounded-2xl border border-white/[0.08] shadow-lg hover:border-white/15 transition-all">
              <h3 className="text-sm font-bold font-sans text-white pb-3 border-b border-white/[0.06] flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-xs font-mono text-slate-400 font-normal">({cat.skills.length})</span>
              </h3>
              <div className="space-y-2.5">
                {cat.skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Case Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              Selected Work
            </span>
            <h2 className="text-3xl font-bold font-sans text-white mt-1">
              Featured Case Studies
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Projects →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 4. Career History Timeline Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            Career Track
          </span>
          <h2 className="text-3xl font-bold font-sans text-white mt-1">
            Work Experience
          </h2>
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#11141a]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-lg flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-white/15 transition-all"
            >
              <div className="space-y-3 md:max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-white font-sans">
                    {exp.role}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-white/[0.06] text-sky-300 border border-white/10 font-mono text-xs font-semibold">
                    {exp.company}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {exp.description}
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400 bg-black/40 px-3.5 py-2 rounded-xl border border-white/[0.08] shrink-0 self-start md:self-auto">
                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Education Background Section */}
      {educations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              Academic Background
            </span>
            <h2 className="text-3xl font-bold font-sans text-white mt-1">
              Education
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educations.map((edu) => (
              <div key={edu.id} className="bg-[#11141a]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-lg space-y-3 hover:border-white/15 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider block">
                      {edu.institution}
                    </span>
                    <h3 className="text-lg font-bold font-sans text-white mt-0.5">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h3>
                  </div>
                  {edu.grade && (
                    <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-semibold shrink-0">
                      {edu.grade}
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-400">
                  {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                  {edu.location && ` • ${edu.location}`}
                </div>

                {edu.description && (
                  <p className="text-sm text-slate-300 leading-relaxed font-sans pt-1">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Contact CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#11141a] via-[#151c28] to-[#11141a] border border-white/15 shadow-[0_0_50px_rgba(56,189,248,0.1)] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 blur-[90px] pointer-events-none rounded-full" />
          
          <div className="space-y-3 text-center lg:text-left relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-sans text-white">Have a mobile app to build or scale?</h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Let&apos;s discuss architecture, performance optimization, or full-time opportunities.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-4 bg-white hover:bg-sky-400 text-black font-mono font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(56,189,248,0.4)] shrink-0 text-xs uppercase tracking-wider active:scale-95 relative z-10"
          >
            Start Conversation →
          </Link>
        </div>
      </section>

    </div>
  );
}
