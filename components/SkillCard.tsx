interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    yearsOfExp?: number | null;
    featured?: boolean;
  };
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <div
      className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-medium flex items-center justify-between transition-all duration-200 ${
        skill.featured
          ? 'bg-[#121927] border border-sky-500/40 text-white shadow-[0_0_15px_rgba(56,189,248,0.12)]'
          : 'bg-[#11141a]/80 border border-white/[0.08] text-slate-300 hover:bg-white/[0.05] hover:border-white/20 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
        <span className="font-semibold tracking-tight">{skill.name}</span>
      </div>

      {skill.yearsOfExp !== null && skill.yearsOfExp !== undefined && (
        <span className="text-[11px] font-mono font-semibold text-sky-300 bg-sky-950/70 border border-sky-800/40 px-2 py-0.5 rounded-md">
          {skill.yearsOfExp} yrs
        </span>
      )}
    </div>
  );
}
