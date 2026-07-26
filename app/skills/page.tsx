import prisma from '@/lib/prisma';
import SkillCard from '@/components/SkillCard';

export const revalidate = 60;

export default async function SkillsPage() {
  const categories = await prisma.skillCategory.findMany({
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono font-bold text-[#006591] uppercase tracking-wider">
          Capabilities & Background
        </span>
        <h1 className="text-4xl font-bold font-sans text-[#091426]">
          Skills, Experience & Education
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Comprehensive inventory of mobile engineering languages, frameworks, reactive architecture, CI/CD tools, career history, and academic foundation.
        </p>
      </div>

      {/* 2. Skills Grid by Category */}
      <section className="space-y-10">
        <h2 className="text-2xl font-bold font-sans text-[#091426] border-b border-gray-200 pb-3">
          Technology Stack & Core Skills
        </h2>

        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold font-sans text-[#091426]">
                  {cat.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#006591]/10 text-[#006591] font-mono text-xs font-semibold">
                  {cat.skills.length} Technologies
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Full Career Experience Timeline */}
      <section className="space-y-10">
        <h2 className="text-2xl font-bold font-sans text-[#091426] border-b border-gray-200 pb-3">
          Professional Work Experience
        </h2>

        <div className="relative border-l-2 border-[#091426]/20 ml-4 pl-6 sm:pl-8 space-y-12">
          {experiences.map((exp) => {
            const achievements: string[] = JSON.parse(exp.achievements || '[]');
            return (
              <div key={exp.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#006591] border-4 border-white shadow-xs group-hover:scale-125 transition-transform" />

                <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-xs font-mono text-[#006591] font-bold uppercase tracking-wider block">
                        {exp.company}
                      </span>
                      <h3 className="text-xl font-bold text-[#091426] font-sans">
                        {exp.role}
                      </h3>
                    </div>

                    <div className="text-xs font-mono text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 self-start sm:self-auto">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                      {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 font-sans leading-relaxed">
                    {exp.description}
                  </p>

                  {achievements.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wide">
                        Key Accomplishments:
                      </h4>
                      <ul className="space-y-1.5 text-sm text-gray-600 font-sans">
                        {achievements.map((ach, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#006591] font-bold">•</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Academic & Education Background */}
      {educations.length > 0 && (
        <section className="space-y-10">
          <h2 className="text-2xl font-bold font-sans text-[#091426] border-b border-gray-200 pb-3">
            Education & Academic Foundation
          </h2>

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

    </div>
  );
}
