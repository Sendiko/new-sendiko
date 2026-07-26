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
      className={`px-3.5 py-2.5 rounded-lg font-mono text-xs font-medium flex items-center justify-between transition-all ${
        skill.featured
          ? 'bg-white border-2 border-[#006591] text-[#091426] shadow-xs'
          : 'bg-[#f2f4f6] border border-[#e0e3e5] text-gray-700 hover:bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#006591]" />
        <span className="font-semibold text-gray-900">{skill.name}</span>
      </div>

      {skill.yearsOfExp !== null && skill.yearsOfExp !== undefined && (
        <span className="text-[11px] font-mono font-semibold text-[#006591] bg-[#006591]/10 px-2 py-0.5 rounded">
          {skill.yearsOfExp} yrs
        </span>
      )}
    </div>
  );
}
