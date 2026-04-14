import { getAllWorks } from '@/lib/vimeo';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const works = await getAllWorks();

  const stats = {
    total: works.length,
    byCategory: {
      corporate: works.filter((w) => w.category === 'corporate').length,
      music: works.filter((w) => w.category === 'music').length,
      filming: works.filter((w) => w.category === 'filming').length,
      sketch: works.filter((w) => w.category === 'sketch').length,
      youtube: works.filter((w) => w.category === 'youtube').length,
    },
    vimeoConnected: works.some((w) => w.vimeoId && w.vimeoId.length > 5),
  };

  const hasToken = !!process.env.VIMEO_ACCESS_TOKEN;

  return <AdminDashboard works={works} stats={stats} hasToken={hasToken} />;
}
