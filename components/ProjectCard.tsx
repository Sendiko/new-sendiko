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
    IOS: { label: 'iOS Native', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
    ANDROID: { label: 'Android Native', bg: 'bg-[#b7131a]/10 text-[#b7131a] border-[#b7131a]/20' },
    CROSS_PLATFORM: { label: 'Cross-Platform', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  }[project.platform];

  return (
    <div className="group bg-white rounded-xl border border-[#e0e3e5] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 bg-[#091426] overflow-hidden">
        {project.coverImageUrl ? (
          // eslint-disable-next-google/no-img-element
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono text-sm bg-[#1e293b]">
            No Preview Available
          </div>
        )}
        
        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${platformBadge.bg}`}>
            {platformBadge.label}
          </span>
          {project.rating && (
            <span className="inline-flex items-center gap-1 bg-[#091426]/80 backdrop-blur-xs text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
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
            <p className="text-xs font-mono text-[#006591] font-medium tracking-wide uppercase">
              {project.architecture}
            </p>
          )}
          <h3 className="text-xl font-bold font-sans text-[#091426] group-hover:text-[#006591] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Chips */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.skills.slice(0, 4).map((s) => (
              <span
                key={s.skill.id}
                className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-xs font-medium border border-gray-200"
              >
                {s.skill.name}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-400 font-mono text-xs">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer Metrics & Link */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500 font-mono">
            {project.downloadsCount
              ? `${(project.downloadsCount / 1000).toFixed(0)}k+ Downloads`
              : 'Production Ready'}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006591] hover:text-[#091426] group-hover:translate-x-0.5 transition-all"
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
