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
    IOS: { label: 'iOS Native App', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
    ANDROID: { label: 'Android Native App', bg: 'bg-[#b7131a]/10 text-[#b7131a] border-[#b7131a]/20' },
    CROSS_PLATFORM: { label: 'Cross-Platform App', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  }[project.platform];

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. Header Banner */}
      <section className="bg-linear-to-b from-[#091426] via-[#1e293b] to-[#091426] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            <span>← Back to Case Studies</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${platformBadge.bg}`}>
              {platformBadge.label}
            </span>
            {project.status && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Status: {project.status}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-sans tracking-tight">
            {project.title}
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl font-sans leading-relaxed">
            {project.tagline}
          </p>

          {/* External Action Bar */}
          <div className="pt-4 flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono font-semibold border border-white/20 flex items-center gap-2 transition-all"
              >
                <span>GitHub Repository</span>
              </a>
            )}
            {project.appStoreUrl && (
              <a
                href={project.appStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-[#006591] hover:bg-[#39b8fd] hover:text-[#091426] text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-2"
              >
                <span>App Store</span>
              </a>
            )}
            {project.playStoreUrl && (
              <a
                href={project.playStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-[#b7131a] hover:bg-red-600 text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-2"
              >
                <span>Google Play</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-[#00a291] hover:bg-teal-400 hover:text-[#091426] text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-2"
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
            <div className="rounded-xl overflow-hidden border border-[#e0e3e5] shadow-lg bg-[#091426]">
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
              <div className="bg-rose-50/70 border border-rose-200/80 p-6 sm:p-8 rounded-xl space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-rose-800 font-mono text-xs font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  The Challenge
                </div>
                <h3 className="text-xl font-bold font-sans text-[#091426]">
                  Problem Statement & Bottlenecks
                </h3>
                <p className="text-gray-800 text-base leading-relaxed font-sans">
                  {project.challenge}
                </p>
              </div>
            )}

            {/* The Solution Card */}
            {project.solution && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 p-6 sm:p-8 rounded-xl space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  The Solution
                </div>
                <h3 className="text-xl font-bold font-sans text-[#091426]">
                  Architectural Resolution & Engineering Approach
                </h3>
                <p className="text-gray-800 text-base leading-relaxed font-sans">
                  {project.solution}
                </p>
              </div>
            )}

          </div>

          {/* Detailed Overview */}
          <div className="space-y-4 bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs">
            <h2 className="text-2xl font-bold font-sans text-[#091426]">
              Detailed Architecture & Execution
            </h2>
            <p className="text-gray-700 leading-relaxed font-sans text-base whitespace-pre-line">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Technical Highlights */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs">
              <h2 className="text-2xl font-bold font-sans text-[#091426]">
                Key Feature Implementations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.features.map((feat) => (
                  <div key={feat.id} className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                    <h3 className="font-bold text-[#091426] text-base font-sans flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#006591]" />
                      {feat.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
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
              <h2 className="text-2xl font-bold font-sans text-[#091426]">
                Screenshots & Visual Assets
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.assets.map((asset) => (
                  <div key={asset.id} className="rounded-xl overflow-hidden border border-[#e0e3e5] bg-white shadow-xs">
                    {/* eslint-disable-next-google/no-img-element */}
                    <img src={asset.url} alt={asset.caption || 'Project screenshot'} className="w-full h-64 object-cover" />
                    {asset.caption && (
                      <p className="p-3 text-xs font-mono text-gray-600 bg-gray-50 border-t border-gray-100">
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
            <div className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs space-y-4">
              <h3 className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
                Project Performance Metrics
              </h3>
              
              <div className="space-y-3 pt-2">
                {project.downloadsCount ? (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-600 font-sans">Total Downloads</span>
                    <span className="font-mono font-bold text-[#091426]">{project.downloadsCount.toLocaleString()}+</span>
                  </div>
                ) : null}
                {project.rating ? (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-600 font-sans">Store Rating</span>
                    <span className="font-mono font-bold text-amber-600">{project.rating.toFixed(1)} / 5.0 ★</span>
                  </div>
                ) : null}
                {project.testCoverage ? (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-600 font-sans">Test Coverage</span>
                    <span className="font-mono font-bold text-[#00a291]">{project.testCoverage}%</span>
                  </div>
                ) : null}
                {project.architecture ? (
                  <div className="py-2 border-b border-gray-100 text-sm space-y-1">
                    <span className="text-gray-600 font-sans block">Pattern & Architecture</span>
                    <span className="font-mono font-semibold text-xs text-[#006591] block">{project.architecture}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs space-y-4">
              <h3 className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
                Project Details
              </h3>
              
              <div className="space-y-3 pt-2">
                {project.status && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-600 font-sans">Status</span>
                    <span className="font-mono font-bold text-[#091426] uppercase">{project.status}</span>
                  </div>
                )}
                {project.githubUrl && (
                  <div className="py-2 border-b border-gray-100 text-sm space-y-1">
                    <span className="text-gray-600 font-sans block">GitHub Repository</span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-semibold text-xs text-[#006591] hover:underline truncate block"
                    >
                      {project.githubUrl}
                    </a>
                  </div>
                )}
                {project.architecture && (
                  <div className="py-2 border-b border-gray-100 text-sm space-y-1">
                    <span className="text-gray-600 font-sans block">Pattern & Architecture</span>
                    <span className="font-mono font-semibold text-xs text-[#006591] block">{project.architecture}</span>
                  </div>
                )}
                {project.testCoverage ? (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                    <span className="text-gray-600 font-sans">Test Coverage</span>
                    <span className="font-mono font-bold text-[#00a291]">{project.testCoverage}%</span>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Tech Stack Chips */}
          {project.skills && project.skills.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs space-y-4">
              <h3 className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.skills.map((s) => (
                  <span
                    key={s.skill.id}
                    className="px-3 py-1.5 rounded-lg bg-[#f2f4f6] text-gray-800 font-mono text-xs font-medium border border-gray-200"
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
