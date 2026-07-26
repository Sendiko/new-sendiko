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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
          Mobile Portfolio & Case Studies
        </span>
        <h1 className="text-4xl font-bold font-sans text-[#091426]">
          Production Engineering Projects
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Detailed breakdown of architecture, technical feature implementations, and metric outcomes for iOS, Android, and Cross-Platform applications.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value as typeof activeFilter)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all font-mono ${
              activeFilter === f.value
                ? 'bg-[#091426] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-[#e0e3e5] hover:bg-gray-100 hover:text-gray-900'
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
            <div key={n} className="bg-white rounded-xl border border-[#e0e3e5] p-6 h-80 animate-pulse space-y-4">
              <div className="h-40 bg-gray-200 rounded-lg" />
              <div className="h-6 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-200 rounded-md w-full" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e0e3e5] space-y-3">
          <p className="text-gray-500 font-mono text-sm">No projects found for the selected filter.</p>
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
