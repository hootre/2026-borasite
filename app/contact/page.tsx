import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact | 프로젝트 문의',
  description: '보라미디어에 영상 제작을 문의하세요. 기업홍보, 뮤직비디오, 이벤트, 광고 영상 전문 제작.',
  alternates: { canonical: 'https://boramedia.co.kr/contact' },
};

// Contact page JSON-LD
const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'BORAMEDIA 문의',
  url: 'https://boramedia.co.kr/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'BORAMEDIA',
    email: 'artinsky@boramedia.co.kr',
    url: 'https://boramedia.co.kr',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-[#7B5EA7] text-sm font-semibold tracking-widest uppercase mb-3">Contact</p>
          <h1 className="text-5xl font-black gradient-text mb-4">프로젝트 문의</h1>
          <p className="text-[#888899] text-lg">
            어떤 영상을 만들고 싶으신가요? 아이디어를 알려주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact form */}
          <div className="glass rounded-2xl p-8 border border-white/5">
            <h2 className="text-lg font-bold text-white mb-6">문의 양식</h2>
            <ContactForm />
          </div>

          {/* Direct contact */}
          <div className="flex flex-col gap-5">
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-[#888899] uppercase tracking-wider mb-4">직접 연락</h3>
              <a
                href="mailto:artinsky@boramedia.co.kr"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7B5EA7]/15 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B5EA7" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[#888899]">이메일</div>
                  <div className="text-sm text-white font-semibold group-hover:text-purple-300 transition-colors">
                    artinsky@boramedia.co.kr
                  </div>
                </div>
              </a>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-[#888899] uppercase tracking-wider mb-4">작업 가능 분야</h3>
              {[
                '기업 홍보·IR 영상',
                '뮤직비디오 제작',
                '이벤트·행사 현장 스케치',
                '광고·TVC',
                '드라마·웹드라마·숏폼',
                '드론 촬영',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B5EA7]" />
                  <span className="text-sm text-[#888899]">{item}</span>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-semibold text-[#888899] uppercase tracking-wider mb-2">응답 시간</h3>
              <p className="text-sm text-white font-semibold">24시간 이내</p>
              <p className="text-xs text-[#888899] mt-1">긴급 프로젝트도 빠르게 대응합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
