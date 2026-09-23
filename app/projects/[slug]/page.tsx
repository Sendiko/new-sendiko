import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      features: {
        orderBy: { order: 'asc' },
      },
      assets: {
        orderBy: { order: 'asc' },
      },
      skills: {
        include: {
          skill: {
            include: { category: true },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const platformBadge = {
    IOS: { label: 'iOS Native App', bg: 'bg-sky-950/70 text-sky-300 border-sky-500/30' },
    ANDROID: { label: 'Android Native App', bg: 'bg-rose-950/70 text-rose-300 border-rose-500/30' },
    CROSS_PLATFORM: { label: 'Cross-Platform App', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30' },
  }[project.platform];

  return (
    <div className="space-y-12 pb-24">
      
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#0c0e14]">
        {/* Ambient glow lights */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-sky-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <span>← Back to Case Studies</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border backdrop-blur-md ${platformBadge.bg}`}>
              {platformBadge.label}
            </span>
            {project.status && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                Status: {project.status}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans tracking-tight text-white">
            {project.title}
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl font-sans leading-relaxed">
            {project.tagline}
          </p>

          {/* External Action Bar */}
          <div className="pt-4 flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl text-xs font-mono font-semibold border border-white/10 hover:border-white/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>GitHub Repository</span>
              </a>
            )}
            {project.appStoreUrl && (
              <a
                href={project.appStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-black rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] active:scale-95"
              >
                <span>App Store</span>
              </a>
            )}
            {project.playStoreUrl && (
              <a
                href={project.playStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95"
              >
                <span>Google Play</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
              >
                <span>Live Interactive Demo</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Main Column */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Cover Asset Preview */}
          {project.coverImageUrl && (
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#08090a]">
              {/* eslint-disable-next-google/no-img-element */}
              <img
                src={project.coverImageUrl}
                alt={project.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* 🔴 Section: The Challenge & 🟢 The Solution */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* The Challenge Card */}
            {project.challenge && (
              <div className="bg-rose-950/20 border border-rose-500/30 p-6 sm:p-8 rounded-2xl space-y-3 shadow-lg shadow-rose-950/10">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                  The Challenge
                </div>
                <h3 className="text-xl font-bold font-sans text-white">
                  Problem Statement & Bottlenecks
                </h3>
                <p className="text-slate-300 text-base leading-relaxed font-sans">
                  {project.challenge}
                </p>
              </div>
            )}

            {/* The Solution Card */}
            {project.solution && (
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 sm:p-8 rounded-2xl space-y-3 shadow-lg shadow-emerald-950/10">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  The Solution
                </div>
                <h3 className="text-xl font-bold font-sans text-white">
                  Architectural Resolution & Engineering Approach
                </h3>
                <p className="text-slate-300 text-base leading-relaxed font-sans">
                  {project.solution}
                </p>
              </div>
            )}

          </div>

          {/* Detailed Overview */}
          <div className="space-y-4 bg-[#11141a]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-lg">
            <h2 className="text-2xl font-bold font-sans text-white">
              Detailed Architecture & Execution
            </h2>
            <p className="text-slate-300 leading-relaxed font-sans text-base whitespace-pre-line">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Technical Highlights */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-6 bg-[#11141a]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-lg">
              <h2 className="text-2xl font-bold font-sans text-white">
                Key Feature Implementations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.features.map((feat) => (
                  <div key={feat.id} className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                    <h3 className="font-bold text-white text-base font-sans flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots Gallery */}
          {project.assets && project.assets.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-sans text-white">
                Screenshots & Visual Assets
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.assets.map((asset) => (
                  <div key={asset.id} className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1017] shadow-lg">
                    {/* eslint-disable-next-google/no-img-element */}
                    <img src={asset.url} alt={asset.caption || 'Project screenshot'} className="w-full h-64 object-cover" />
                    {asset.caption && (
                      <p className="p-3 text-xs font-mono text-slate-400 bg-black/50 border-t border-white/[0.06]">
                        {asset.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar: Metrics & Tech Stack */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Key Engineering Metrics or Project Details */}
          {project.appStoreUrl || project.playStoreUrl ? (
            <div className="bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg space-y-4">
              <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
                Project Performance Metrics
              </h3>
              
              <div className="space-y-3 pt-2">
                {project.downloadsCount ? (
                  <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06] text-sm">
                    <span className="text-slate-400 font-sans">Total Downloads</span>
                    <span className="font-mono font-bold text-white">{project.downloadsCount.toLocaleString()}+</span>
                  </div>
                ) : null}
                {project.rating ? (
                  <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06] text-sm">
                    <span className="text-slate-400 font-sans">Store Rating</span>
                    <span className="font-mono font-bold text-amber-300">{project.rating.toFixed(1)} / 5.0 ★</span>
                  </div>
                ) : null}
                {project.testCoverage ? (
                  <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06] text-sm">
                    <span className="text-slate-400 font-sans">Test Coverage</span>
                    <span className="font-mono font-bold text-emerald-400">{project.testCoverage}%</span>
                  </div>
                ) : null}
                {project.architecture ? (
                  <div className="py-2.5 border-b border-white/[0.06] text-sm space-y-1">
                    <span className="text-slate-400 font-sans block">Pattern & Architecture</span>
                    <span className="font-mono font-semibold text-xs text-sky-400 block">{project.architecture}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg space-y-4">
              <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
                Project Details
              </h3>
              
              <div className="space-y-3 pt-2">
                {project.status && (
                  <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06] text-sm">
                    <span className="text-slate-400 font-sans">Status</span>
                    <span className="font-mono font-bold text-white uppercase">{project.status}</span>
                  </div>
                )}
                {project.githubUrl && (
                  <div className="py-2.5 border-b border-white/[0.06] text-sm space-y-1">
                    <span className="text-slate-400 font-sans block">GitHub Repository</span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-semibold text-xs text-sky-400 hover:underline truncate block"
                    >
                      {project.githubUrl}
                    </a>
                  </div>
                )}
                {project.architecture && (
                  <div className="py-2.5 border-b border-white/[0.06] text-sm space-y-1">
                    <span className="text-slate-400 font-sans block">Pattern & Architecture</span>
                    <span className="font-mono font-semibold text-xs text-sky-400 block">{project.architecture}</span>
                  </div>
                )}
                {project.testCoverage ? (
                  <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06] text-sm">
                    <span className="text-slate-400 font-sans">Test Coverage</span>
                    <span className="font-mono font-bold text-emerald-400">{project.testCoverage}%</span>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Tech Stack Chips */}
          {project.skills && project.skills.length > 0 && (
            <div className="bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg space-y-4">
              <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.skills.map((s) => (
                  <span
                    key={s.skill.id}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-slate-300 font-mono text-xs font-medium border border-white/[0.08]"
                  >
                    {s.skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
