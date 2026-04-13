import type { Metadata } from 'next';
import Hero from '@/components/Hero';
// KeywordsStrip removed
import WorksGrid from '@/components/WorksGrid';
// ClientLogos is now integrated into Stats as background
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import ContactSection from '@/components/ContactSection';
import { getAllWorks, getShowreel } from '@/lib/vimeo';

export const metadata: Metadata = {
  title: 'BORAMEDIA | 영상 프로덕션 전문 기업',
  description:
    '보라미디어는 기업홍보, 뮤직비디오, 이벤트, 광고 영상을 전문으로 제작합니다. 삼성, 한국관광공사, 쿠팡, 한화시스템 등과 함께한 영상 프로덕션 전문 기업.',
};

// Homepage JSON-LD
function HomeSchema({ worksCount }: { worksCount: number }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'BORAMEDIA 홈페이지',
    description: '영상 프로덕션 전문 기업 보라미디어 공식 홈페이지',
    url: 'https://boramedia.co.kr',
    mainEntity: {
      '@type': 'VideoProductionCompany',
      name: 'BORAMEDIA',
      url: 'https://boramedia.co.kr',
      numberOfItems: worksCount,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function HomePage() {
  const [works, showreel] = await Promise.all([getAllWorks(), getShowreel()]);
  const featuredWorks = works;
  // Recent 3 unique clients (works already sorted by date desc)
  const recentClients = [...new Set(works.map((w) => w.client))].slice(0, 3);

  return (
    <>
      <HomeSchema worksCount={works.length} />
      <Hero showreelEmbedUrl={showreel?.embedUrl} recentClients={recentClients} />
      <WorksGrid works={featuredWorks} />
      <Stats />
      <Services />
      <ContactSection />
    </>
  );
}
