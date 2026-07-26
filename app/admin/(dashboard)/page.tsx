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
      <div className="bg-linear-to-r from-[#091426] to-[#006591] text-white p-8 rounded-xl shadow-md space-y-2">
        <h2 className="text-2xl font-bold font-sans">Welcome to your Portfolio CMS</h2>
        <p className="text-sm text-gray-200">
          Manage projects, update your bio, adjust skill metrics, and review contact submissions in real-time.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Link href="/admin/projects" className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs hover:border-[#006591] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">Projects</span>
            <span className="text-xl">📱</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#091426] mt-2 group-hover:text-[#006591]">
            {projectsCount}
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">Manage case studies</p>
        </Link>

        <Link href="/admin/skills" className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs hover:border-[#006591] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">Tech Skills</span>
            <span className="text-xl">⚡</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#091426] mt-2 group-hover:text-[#006591]">
            {skillsCount}
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">Manage skill tags</p>
        </Link>

        <Link href="/admin/experiences" className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs hover:border-[#006591] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">Experience</span>
            <span className="text-xl">💼</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#091426] mt-2 group-hover:text-[#006591]">
            {experiencesCount}
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">Career timeline</p>
        </Link>

        <Link href="/admin/messages" className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs hover:border-[#006591] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">Messages</span>
            <span className="text-xl">📩</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#091426] mt-2 group-hover:text-[#006591]">
            {messagesCount}
          </div>
          <p className="text-xs text-emerald-600 font-mono font-semibold mt-1">
            {unreadMessagesCount} Unread
          </p>
        </Link>

      </div>

      {/* Quick Shortcuts & Inbox Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs space-y-4">
          <h3 className="font-bold text-[#091426] text-lg font-sans border-b border-gray-100 pb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <Link href="/admin/projects" className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] hover:bg-gray-100 font-semibold text-[#091426] flex items-center gap-2">
              <span>+ Add New Project</span>
            </Link>
            <Link href="/admin/profile" className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] hover:bg-gray-100 font-semibold text-[#091426] flex items-center gap-2">
              <span>✏️ Edit Profile Info</span>
            </Link>
            <Link href="/admin/skills" className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] hover:bg-gray-100 font-semibold text-[#091426] flex items-center gap-2">
              <span>⚡ Add Tech Skill</span>
            </Link>
            <Link href="/admin/education" className="p-4 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] hover:bg-gray-100 font-semibold text-[#091426] flex items-center gap-2">
              <span>🎓 Add Education ({educationCount})</span>
            </Link>
          </div>
        </div>

        {/* Recent Messages Inbox Preview */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-[#091426] text-lg font-sans">
              Recent Messages
            </h3>
            <Link href="/admin/messages" className="text-xs font-mono font-bold text-[#006591]">
              View All →
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-gray-500 font-mono py-4">No contact messages received yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between items-center font-mono">
                    <span className="font-bold text-[#091426]">{msg.senderName} ({msg.senderEmail})</span>
                    <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-gray-800">{msg.subject}</p>
                  <p className="text-gray-600 line-clamp-1">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
