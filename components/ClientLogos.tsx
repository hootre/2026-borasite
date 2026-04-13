'use client';

const CLIENTS = [
  '한국관광공사', 'SAMSUNG', '서울의 산행', '한국지역아동센터연합회', 'Amway',
  'Japan Endless Discovery', 'PUMA', 'fantagio', 'CHUNGCHUN MUSIC',
  'MESSE ESANG', '교촌에프엔비', '한화시스템', '쿠팡', 'GOCAF',
  'ILLUSTRATION KOREA', 'COBE BABY & EDU FAIR',
];

export default function ClientLogos() {
  return (
    <section className="border-y border-[#22223A] py-14">
      <p className="text-center text-xs text-[#888899] font-bold tracking-widest uppercase mb-7">
        함께한 클라이언트
      </p>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {CLIENTS.map((name) => (
            <div
              key={name}
              className="group flex items-center justify-center rounded-xl border border-white/[0.06] py-3.5 px-2 min-h-[60px] cursor-default transition-all duration-300"
              style={{ background: 'rgba(20,20,31,0.5)' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(123,94,167,0.35)';
                el.style.background = 'rgba(123,94,167,0.08)';
                el.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '';
                el.style.background = 'rgba(20,20,31,0.5)';
                el.style.transform = '';
              }}
            >
              <span className="text-[11px] font-black text-[#888899] tracking-[0.05em] text-center leading-tight group-hover:text-white transition-colors">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
