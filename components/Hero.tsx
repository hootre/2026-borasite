"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface HeroProps {
  showreelEmbedUrl?: string | null;
  recentClients?: string[];
}

export default function Hero({ showreelEmbedUrl, recentClients }: HeroProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add("visible"), 100);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orb */}
      <div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7B5EA7 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-24 pb-20 grid lg:grid-cols-5 gap-12 items-center">
        {/* Left: Text */}
        <div ref={textRef} className="reveal lg:col-span-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-purple-300 mb-8 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            영상 프로덕션 전문 기업
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="gradient-text">생동감 넘치게</span>
            <br />
            <span className="text-white">당신의 이야기를</span>
            <br />
            <span className="gradient-text-gold">기록해드립니다.</span>
          </h1>

          <p className="text-[#888899] text-lg leading-relaxed mb-10 max-w-lg">
            영상이라는 매체로 당신의 순간을 생생하게 기록합니다.
            <br />
            기업홍보 · 공연 · 뮤직비디오 · 이벤트 · 광고 영상 전문 제작.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/works" className="btn-primary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              작품 보기
            </Link>
            <Link href="/contact" className="btn-secondary">
              프로젝트 문의
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 mt-12 pt-8 border-t border-[#22223A] w-full">
            {[
              { num: "137+", label: "고객사" },
              { num: "385+", label: "제작 영상" },
              { num: "5+", label: "전문 팀원" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-4xl lg:text-5xl font-black gradient-text">
                  {num}
                </div>
                <div className="text-sm text-[#888899] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Showreel card */}
        <div className="relative hidden lg:block lg:col-span-3">
          <div className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            {/* Vimeo showreel embed */}
            <div className="video-wrapper">
              <iframe
                src={showreelEmbedUrl ? `${showreelEmbedUrl}&background=1&autoplay=1&loop=1&muted=1` : 'about:blank'}
                allow="autoplay; fullscreen; picture-in-picture"
                style={{ border: 0 }}
                title="BORAMEDIA Showreel"
              />
            </div>
            {/* Overlay badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              SHOWREEL 2026
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
        <span className="text-xs text-[#888899] tracking-widest animate-pulse">
          SCROLL
        </span>
        <div className="relative w-5 h-8 rounded-full border border-[#888899]/50">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 rounded-full bg-[#888899] animate-scroll-dot" />
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888899"
          strokeWidth="2"
          className="animate-pulse opacity-60"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
