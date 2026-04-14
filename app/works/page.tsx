import type { Metadata } from 'next';
import WorksGrid from '@/components/WorksGrid';
import { getAllWorks } from '@/lib/vimeo';
import { getSiteConfig } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Works | 포트폴리오',
  description: '보라미디어의 모든 작품 포트폴리오. 기업홍보, 뮤직비디오, 이벤트, 광고 영상을 확인하세요.',
  alternates: { canonical: 'https://boramedia.co.kr/works' },
};

export default async function WorksPage() {
  const [works, siteConfig] = await Promise.all([getAllWorks(), Promise.resolve(getSiteConfig())]);
  const customCategoryLabels = {
    all:       siteConfig.catAll,
    corporate: siteConfig.catCorporate,
    music:     siteConfig.catMusic,
    filming:   siteConfig.catFilming,
    sketch:    siteConfig.catSketch,
    youtube:   siteConfig.catYoutube,
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Page header */}
      <div className="py-16 px-6 max-w-7xl mx-auto hero-gradient text-center md:text-left">
        <p className="text-[#7B5EA7] text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
          <span className="gradient-text">All Works</span>
        </h1>
        <p className="text-[#888899] mt-4 text-lg max-w-md mx-auto md:mx-0">
          보라미디어가 만든 {works.length}편의 영상 작품을 확인하세요.
        </p>
      </div>
      <WorksGrid works={works} customCategoryLabels={customCategoryLabels} />
    </div>
  );
}
