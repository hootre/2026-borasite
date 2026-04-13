'use client';

import { useEffect, useRef } from 'react';

const SERVICES = [
  {
    icon: '📽️',
    title: '고퀄리티 기록',
    desc: '최신 장비와 시네마틱 기법으로 당신의 순간을 고해상도로 생생하게 기록합니다.',
    color: '#7B5EA7',
  },
  {
    icon: '🎤',
    title: '공연·이벤트 특화',
    desc: '공연, 행사, 박람회 현장의 생동감을 온전히 담아내는 현장 촬영 전문팀.',
    color: '#C9A84C',
  },
  {
    icon: '⚡',
    title: '올인원 워크플로우',
    desc: '기획 · 촬영 · 편집 · 납품까지 원스톱 처리로 시간과 비용을 절감합니다.',
    color: '#4ECDC4',
  },
  {
    icon: '💾',
    title: '안정적 데이터 보관',
    desc: '프라이빗 서버와 Google Cloud로 1년간 안전하게 원본 데이터를 보관합니다.',
    color: '#7B5EA7',
  },
  {
    icon: '🌐',
    title: '글로벌 대응',
    desc: '한국을 중심으로 해외 프로젝트까지 언어·문화 장벽 없이 유연하게 대응합니다.',
    color: '#9B72CF',
  },
  {
    icon: '❤️',
    title: '높은 재방문율',
    desc: '재방문 고객이 많다는 사실이 우리의 품질과 신뢰를 가장 잘 증명합니다.',
    color: '#FF6B9D',
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-[#10101A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="text-[#7B5EA7] text-sm font-semibold tracking-widest uppercase mb-3">Why BORAMEDIA</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white">
            우리가 다른 이유
          </h2>
          <p className="text-[#888899] mt-4 max-w-lg mx-auto">
            보라미디어 팀은 고객과의 약속을 기반으로 높은 품질과 정성 어린 콘텐츠를 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="reveal glass glass-hover rounded-2xl p-7 border border-white/5 cursor-default"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl"
                style={{ backgroundColor: `${s.color}18` }}
              >
                {s.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-[#888899] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
