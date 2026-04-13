'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { num: 137, suffix: '+', label: 'Happy Customers',   desc: '누적 고객사' },
  { num: 385, suffix: '+', label: 'Content Provided',  desc: '제작 완료 영상' },
  { num: 5,   suffix: '+', label: 'Professional Team', desc: '전문 팀원' },
  { num: 27,  suffix: '',  label: 'Partner Companies', desc: '파트너사' },
];


function useCounter(target: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, started]);
  return count;
}

function StatItem({ num, suffix, label, desc, started }: typeof STATS[0] & { started: boolean }) {
  const count = useCounter(num, started);
  return (
    <div className="text-center lg:text-left">
      <div className="stat-number gradient-text">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-white font-semibold mt-2">{label}</div>
      <div className="text-[#888899] text-sm mt-0.5">{desc}</div>
    </div>
  );
}


export default function Stats() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-36 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D0D1A 0%, #131325 50%, #0D0D1A 100%)' }}>
      {/* BG accent */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(123,94,167,0.12) 0%, transparent 70%)' }}
      />

      {/* Client logos marquee background layer */}
      <div className="absolute inset-0 pointer-events-none flex items-center opacity-[0.1] overflow-hidden">
        <div className="flex items-center gap-10 animate-marquee-clients whitespace-nowrap" style={{ width: 'max-content' }}>
          <img src="/clients/full.png" alt="" className="h-36 sm:h-48 lg:h-60 object-contain flex-shrink-0" />
          <img src="/clients/full.png" alt="" className="h-36 sm:h-48 lg:h-60 object-contain flex-shrink-0" />
          <img src="/clients/full.png" alt="" className="h-36 sm:h-48 lg:h-60 object-contain flex-shrink-0" />
          <img src="/clients/full.png" alt="" className="h-36 sm:h-48 lg:h-60 object-contain flex-shrink-0" />
          <img src="/clients/full.png" alt="" className="h-36 sm:h-48 lg:h-60 object-contain flex-shrink-0" />
          <img src="/clients/full.png" alt="" className="h-36 sm:h-48 lg:h-60 object-contain flex-shrink-0" />
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-[#888899] text-xs font-bold tracking-widest uppercase mb-3">
            함께한 클라이언트
          </p>
          <p className="text-[#7B5EA7] text-sm font-semibold tracking-widest uppercase mb-3">Numbers</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white">
            팀의 성과를 숫자로
          </h2>
          <p className="text-[#888899] mt-4 max-w-md mx-auto">
            창의성과 전문성을 기반으로, 가장 중요한 것은 재방문 고객입니다.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {STATS.map((s) => <StatItem key={s.label} {...s} started={started} />)}
        </div>
      </div>
    </section>
  );
}
