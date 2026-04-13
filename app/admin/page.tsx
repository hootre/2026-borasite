import { getAllWorks } from '@/lib/vimeo';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const works = await getAllWorks();

  const stats = {
    total: works.length,
    byCategory: {
      corporate: works.filter((w) => w.category === 'corporate').length,
      event: works.filter((w) => w.category === 'event').length,
      music: works.filter((w) => w.category === 'music').length,
      ad: works.filter((w) => w.category === 'ad').length,
      drama: works.filter((w) => w.category === 'drama').length,
    },
    vimeoConnected: works.some((w) => w.vimeoId && w.vimeoId.length > 5),
  };

  const hasToken = !!process.env.VIMEO_ACCESS_TOKEN;

  return <AdminDashboard works={works} stats={stats} hasToken={hasToken} />;
}
