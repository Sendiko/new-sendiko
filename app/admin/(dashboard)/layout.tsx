import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebarClient from './AdminSidebarClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  if (session !== 'authenticated') {
    redirect('/admin/login');
  }

  return <AdminSidebarClient>{children}</AdminSidebarClient>;
}
