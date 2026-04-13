import type { Metadata } from 'next';
import WorksGrid from '@/components/WorksGrid';
import { getAllWorks } from '@/lib/vimeo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Works | 포트폴리오',
  description: '보라미디어의 모든 작품 포트폴리오. 기업홍보, 뮤직비디오, 이벤트, 광고 영상을 확인하세요.',
  alternates: { canonical: 'https://boramedia.co.kr/works' },
};

export default async function WorksPage() {
  const works = await getAllWorks();

  return (
    <div className="min-h-screen pt-20">
      {/* Page header */}
      <div className="py-16 px-6 max-w-7xl mx-auto hero-gradient">
        <p className="text-[#7B5EA7] text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
          <span className="gradient-text">All Works</span>
        </h1>
        <p className="text-[#888899] mt-4 text-lg max-w-md">
          보라미디어가 만든 {works.length}편의 영상 작품을 확인하세요.
        </p>
      </div>
      <WorksGrid works={works} />
    </div>
  );
}
