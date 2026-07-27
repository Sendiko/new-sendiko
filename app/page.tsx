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
    orderBy: { order: 'asc' },
  });

  const educations = await prisma.education.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-20 pb-20">

      {/* 1. Hero Section */}
      <section className="bg-linear-to-b from-[#091426] via-[#1e293b] to-[#091426] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Left Intro */}
            <div className="lg:col-span-8 space-y-6">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans tracking-tight leading-tight">
                {profile?.headline || 'Senior Mobile Software Engineer'}
              </h1>

              <p className="text-gray-300 text-lg sm:text-xl max-w-2xl leading-relaxed font-sans">
                {profile?.bio || 'Building resilient, high-speed mobile applications with SwiftUI, Jetpack Compose, and Clean Architecture.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 bg-[#006591] hover:bg-[#39b8fd] text-white hover:text-[#091426] font-semibold rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Explore Case Studies</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-sm transition-all border border-white/20"
                >
                  Contact Developer
                </Link>
              </div>
            </div>

            {/* Hero Right Avatar / Stats */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative p-1 rounded-2xl bg-linear-to-tr from-[#006591] via-[#00a291] to-sky-400 shadow-2xl">
                <div className="bg-[#091426] p-6 rounded-[14px] text-center space-y-6 w-full max-w-sm">
                  <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#006591]">
                    {/* eslint-disable-next-google/no-img-element */}
                    <img
                      src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600'}
                      alt={profile?.name || 'Rizky Sendiko'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-sans">{profile?.name}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-1">{profile?.location}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-800 flex justify-center text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#00a291] font-mono">
                        {profile?.yearsExperience || 5}+ Yrs
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono uppercase">Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* Metrics Bar
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-800/80">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl font-extrabold text-white font-mono">250K+</div>
              <div className="text-xs text-gray-400 font-mono mt-1">Total App Installs</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl font-extrabold text-[#39b8fd] font-mono">4.9 ★</div>
              <div className="text-xs text-gray-400 font-mono mt-1">Average Store Rating</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl font-extrabold text-[#00a291] font-mono">94%</div>
              <div className="text-xs text-gray-400 font-mono mt-1">Avg Unit Test Coverage</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl font-extrabold text-amber-300 font-mono">100%</div>
              <div className="text-xs text-gray-400 font-mono mt-1">Clean Arch Compliance</div>
            </div>
          </div> */}
        </div>
      </section>

      {/* 2. Core Skill Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
              Technical Competencies
            </span>
            <h2 className="text-3xl font-bold font-sans text-[#091426] mt-1">
              Technical Stack & Skills
            </h2>
          </div>
          <Link
            href="/skills"
            className="text-xs font-mono font-bold text-[#006591] hover:text-[#091426] flex items-center gap-1"
          >
            <span>View All Technologies →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat) => (
            <div key={cat.id} className="space-y-4 bg-white p-5 rounded-xl border border-[#e0e3e5] shadow-xs">
              <h3 className="text-base font-bold font-sans text-[#091426] pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-xs font-mono text-gray-400 font-normal">({cat.skills.length})</span>
              </h3>
              <div className="space-y-3">
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
            <span className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
              Selected Work
            </span>
            <h2 className="text-3xl font-bold font-sans text-[#091426] mt-1">
              Featured Case Studies
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs font-mono font-bold text-[#006591] hover:text-[#091426] flex items-center gap-1"
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
          <span className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
            Career Track
          </span>
          <h2 className="text-3xl font-bold font-sans text-[#091426] mt-1">
            Work Experience
          </h2>
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="space-y-2 md:max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-[#091426] font-sans">
                    {exp.role}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-mono text-xs font-semibold">
                    {exp.company}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-sans">
                  {exp.description}
                </p>
              </div>

              <div className="text-xs font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 shrink-0">
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
            <span className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
              Academic Background
            </span>
            <h2 className="text-3xl font-bold font-sans text-[#091426] mt-1">
              Education
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educations.map((edu) => (
              <div key={edu.id} className="bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-[#006591] font-bold uppercase tracking-wider block">
                      {edu.institution}
                    </span>
                    <h3 className="text-lg font-bold font-sans text-[#091426]">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h3>
                  </div>
                  {edu.grade && (
                    <span className="px-2.5 py-1 rounded bg-[#00a291]/10 text-[#00a291] font-mono text-xs font-semibold">
                      {edu.grade}
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-gray-400">
                  {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                  {edu.location && ` • ${edu.location}`}
                </div>

                {edu.description && (
                  <p className="text-sm text-gray-600 leading-relaxed font-sans pt-1">
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
        <div className="bg-linear-to-r from-[#091426] to-[#006591] text-white rounded-2xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-3xl font-bold font-sans">Have a mobile app to build or scale?</h2>
            <p className="text-gray-200 text-sm max-w-xl">
              Let&apos;s discuss architecture, performance optimization, or full-time opportunities.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-4 bg-white text-[#091426] hover:bg-gray-100 font-bold rounded-xl transition-all shadow-md shrink-0 text-sm"
          >
            Start Conversation
          </Link>
        </div>
      </section>

    </div>
  );
}
