'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  platform: 'IOS' | 'ANDROID' | 'CROSS_PLATFORM';
  coverImageUrl?: string | null;
  architecture?: string | null;
  downloadsCount?: number;
  rating?: number;
  skills?: { skill: { id: string; name: string } }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IOS' | 'ANDROID' | 'CROSS_PLATFORM'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const url = activeFilter === 'ALL' ? '/api/projects' : `/api/projects?platform=${activeFilter}`;
        const res = await fetch(url);
        const json = await res.json();
        setProjects(json.data || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [activeFilter]);

  const filters = [
    { label: 'All Projects', value: 'ALL' },
    { label: 'iOS Native', value: 'IOS' },
    { label: 'Android Native', value: 'ANDROID' },
    { label: 'Cross-Platform', value: 'CROSS_PLATFORM' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
          Mobile Portfolio & Case Studies
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-sans text-white tracking-tight">
          Production Engineering Projects
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Detailed breakdown of architecture, technical feature implementations, and metric outcomes for iOS, Android, and Cross-Platform applications.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 border-b border-white/[0.08] pb-5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value as typeof activeFilter)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all font-mono tracking-wide cursor-pointer ${
              activeFilter === f.value
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(56,189,248,0.25)] border border-sky-400/50'
                : 'bg-[#11141a]/80 text-slate-300 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white hover:border-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[#11141a]/80 rounded-2xl border border-white/[0.08] p-6 h-80 animate-pulse space-y-4">
              <div className="h-40 bg-white/[0.05] rounded-xl" />
              <div className="h-6 bg-white/[0.05] rounded-md w-3/4" />
              <div className="h-4 bg-white/[0.05] rounded-md w-full" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-[#11141a]/80 rounded-2xl border border-white/[0.08] space-y-3">
          <p className="text-slate-400 font-mono text-sm">No projects found for the selected platform filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    </div>
  );
}
