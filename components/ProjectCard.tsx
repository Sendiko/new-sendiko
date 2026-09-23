import Link from 'next/link';

interface SkillItem {
  skill: {
    id: string;
    name: string;
  };
}

interface ProjectCardProps {
  project: {
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
    skills?: SkillItem[];
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const platformBadge = {
    IOS: { label: 'iOS Native', bg: 'bg-sky-950/70 text-sky-300 border-sky-500/30' },
    ANDROID: { label: 'Android Native', bg: 'bg-rose-950/70 text-rose-300 border-rose-500/30' },
    CROSS_PLATFORM: { label: 'Cross-Platform', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30' },
  }[project.platform];

  return (
    <div className="group relative bg-[#11141a]/85 backdrop-blur-md rounded-2xl border border-white/[0.08] hover:border-sky-500/40 hover:shadow-[0_10px_35px_-5px_rgba(56,189,248,0.12)] transition-all duration-300 flex flex-col h-full hover:-translate-y-1 overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 bg-[#08090a] overflow-hidden">
        {project.coverImageUrl ? (
          // eslint-disable-next-google/no-img-element
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-sm bg-[#0d1017]">
            No Preview Available
          </div>
        )}

        {/* Gradient shadow overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11141a] via-transparent to-black/40 pointer-events-none" />
        
        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border backdrop-blur-md ${platformBadge.bg}`}>
            {platformBadge.label}
          </span>
          {project.rating && (
            <span className="inline-flex items-center gap-1 bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <span>★</span>
              <span>{project.rating.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {project.architecture && (
            <p className="text-xs font-mono text-sky-400 font-semibold tracking-wide uppercase">
              {project.architecture}
            </p>
          )}
          <h3 className="text-xl font-bold font-sans text-white group-hover:text-sky-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Chips */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.skills.slice(0, 4).map((s) => (
              <span
                key={s.skill.id}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 font-mono text-xs font-medium border border-white/[0.08]"
              >
                {s.skill.name}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-lg bg-white/[0.02] text-slate-500 font-mono text-xs border border-white/[0.04]">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer Metrics & Link */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {project.downloadsCount
              ? `${(project.downloadsCount / 1000).toFixed(0)}k+ Downloads`
              : 'Production Ready'}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-sky-400 hover:text-sky-300 group-hover:translate-x-1 transition-all"
          >
            <span>View Case Study</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
