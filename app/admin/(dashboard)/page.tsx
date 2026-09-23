import Link from 'next/link';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  const projectsCount = await prisma.project.count();
  const skillsCount = await prisma.skill.count();
  const experiencesCount = await prisma.workExperience.count();
  const educationCount = await prisma.education.count();
  const messagesCount = await prisma.contactMessage.count();
  const unreadMessagesCount = await prisma.contactMessage.count({ where: { status: 'UNREAD' } });

  const recentMessages = await prisma.contactMessage.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-[#11141a] via-[#161f2e] to-[#11141a] border border-white/10 shadow-lg space-y-2">
        <div className="absolute top-0 right-10 w-64 h-64 bg-sky-500/10 blur-[60px] pointer-events-none rounded-full" />
        <h2 className="text-2xl font-bold font-sans text-white relative z-10">Welcome to your Portfolio CMS</h2>
        <p className="text-sm text-slate-300 relative z-10">
          Manage projects, update your bio, adjust skill metrics, and review contact submissions in real-time.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Link href="/admin/projects" className="bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg hover:border-sky-500/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Projects</span>
            <span className="text-xl">📱</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 group-hover:text-sky-400 transition-colors">
            {projectsCount}
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">Manage case studies</p>
        </Link>

        <Link href="/admin/skills" className="bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg hover:border-sky-500/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Tech Skills</span>
            <span className="text-xl">⚡</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 group-hover:text-sky-400 transition-colors">
            {skillsCount}
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">Manage skill tags</p>
        </Link>

        <Link href="/admin/experiences" className="bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg hover:border-sky-500/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Experience</span>
            <span className="text-xl">💼</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 group-hover:text-sky-400 transition-colors">
            {experiencesCount}
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">Career timeline</p>
        </Link>

        <Link href="/admin/messages" className="bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg hover:border-sky-500/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Messages</span>
            <span className="text-xl">📩</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 group-hover:text-sky-400 transition-colors">
            {messagesCount}
          </div>
          <p className="text-xs text-emerald-400 font-mono font-semibold mt-1">
            {unreadMessagesCount} Unread
          </p>
        </Link>

      </div>

      {/* Quick Shortcuts & Inbox Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-6 bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg space-y-4">
          <h3 className="font-bold text-white text-lg font-sans border-b border-white/[0.06] pb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <Link href="/admin/projects" className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all">
              <span>+ Add New Project</span>
            </Link>
            <Link href="/admin/profile" className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all">
              <span>✏️ Edit Profile Info</span>
            </Link>
            <Link href="/admin/skills" className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all">
              <span>⚡ Add Tech Skill</span>
            </Link>
            <Link href="/admin/education" className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all">
              <span>🎓 Add Education ({educationCount})</span>
            </Link>
          </div>
        </div>

        {/* Recent Messages Inbox Preview */}
        <div className="lg:col-span-6 bg-[#11141a]/85 backdrop-blur-md p-6 rounded-2xl border border-white/[0.08] shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <h3 className="font-bold text-white text-lg font-sans">
              Recent Messages
            </h3>
            <Link href="/admin/messages" className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors">
              View All →
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-4">No contact messages received yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs space-y-1">
                  <div className="flex justify-between items-center font-mono">
                    <span className="font-bold text-white">{msg.senderName} ({msg.senderEmail})</span>
                    <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-slate-200">{msg.subject}</p>
                  <p className="text-slate-400 line-clamp-1">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
