import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | 보라미디어 소개',
  description: '보라미디어는 창의성과 전문성을 기반으로 최고 품질의 영상을 제작하는 영상 프로덕션 전문 기업입니다.',
  alternates: { canonical: 'https://boramedia.co.kr/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-20 px-6 max-w-7xl mx-auto hero-gradient">
        <p className="text-[#7B5EA7] text-sm font-semibold tracking-widest uppercase mb-3">About Us</p>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
          <span className="gradient-text">BORAMEDIA</span>
        </h1>
        <p className="text-[#888899] mt-4 text-xl max-w-xl">
          우리는 당신의 이야기를 현실로 만드는 영상 전문가입니다.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Story */}
        <div className="glass rounded-2xl p-10 border border-white/5 mb-8">
          <h2 className="text-2xl font-black text-white mb-6">Our Story</h2>
          <div className="space-y-4 text-[#888899] leading-relaxed">
            <p>
              보라미디어는 콘텐츠, 스토리텔링, 내러티브 중심의 서비스를 제공하는 영상 프로덕션 전문 기업입니다.
              시네마틱 비주얼에 초점을 맞춰 뮤직비디오, 광고, 드라마, 홍보 영상을 주로 제작합니다.
            </p>
            <p>
              우리 팀은 창의성과 전문성을 기반으로 구성되어 있으며, 가장 중요한 것은
              <span className="text-white font-semibold"> 재방문 고객</span>이 있다는 사실입니다.
              이는 우리의 품질과 신뢰의 가장 강력한 증거입니다.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            { title: '창의성', desc: '모든 프로젝트에 독창적인 시각과 아이디어를 담습니다.' },
            { title: '전문성', desc: '각 분야 최고 전문가들이 완성도 높은 결과물을 만듭니다.' },
            { title: '신뢰', desc: '고객과의 약속을 최우선으로 생각하며, 마감을 지킵니다.' },
          ].map(({ title, desc }) => (
            <div key={title} className="glass rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-[#888899] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/contact" className="btn-primary text-base px-8 py-4">
            함께 시작하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
