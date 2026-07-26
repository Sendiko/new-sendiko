import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebarClient from './AdminSidebarClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  console.log('[AUTH LOG] Layout checking admin_session cookie:', session);
  console.log('[AUTH LOG] All cookies:', cookieStore.getAll());

  if (session !== 'authenticated' && session !== 'true') {
    console.log('[AUTH LOG] Session invalid! Redirecting to /admin/login');
    redirect('/admin/login');
  }

  console.log('[AUTH LOG] Session valid! Access granted to Admin Dashboard.');
  return <AdminSidebarClient>{children}</AdminSidebarClient>;
}
