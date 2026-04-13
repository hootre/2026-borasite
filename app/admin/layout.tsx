import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | BORAMEDIA',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      {children}
    </div>
  );
}
