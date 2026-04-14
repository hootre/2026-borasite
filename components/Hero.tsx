"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SiteConfig, DEFAULT_CONFIG } from "@/lib/siteConfigTypes";

interface HeroProps {
  showreelEmbedUrl?: string | null;
  recentClients?: string[];
  siteConfig?: SiteConfig;
}

export default function Hero({ showreelEmbedUrl, siteConfig }: HeroProps) {
  const cfg = siteConfig ?? DEFAULT_CONFIG;
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

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-24 pb-24">

        {/* 모바일: showreel 상단 배치 */}
        <div className="block lg:hidden mb-6 relative">
          <div className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="video-wrapper">
              <iframe
                src={showreelEmbedUrl ? `${showreelEmbedUrl}&background=1&autoplay=1&loop=1&muted=1` : 'about:blank'}
                allow="autoplay; fullscreen; picture-in-picture"
                style={{ border: 0 }}
                title="BORAMEDIA Showreel"
              />
            </div>
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 glass px-2.5 py-1 rounded-full text-[11px] font-semibold text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              SHOWREEL 2026
            </div>
          </div>
        </div>

        {/* 데스크톱: 기존 좌우 레이아웃 */}
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left: Text */}
          <div ref={textRef} className="reveal lg:col-span-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-purple-300 mb-6 sm:mb-8 border border-purple-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              {cfg.heroBadge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-5 sm:mb-6">
              <span className="gradient-text">{cfg.heroLine1}</span>
              <br />
              <span className="text-white">{cfg.heroLine2}</span>
              <br />
              <span className="gradient-text-gold">{cfg.heroLine3}</span>
            </h1>

            <p className="text-[#888899] text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0">
              {cfg.heroSubtitle.split('\n').map((line, i) => (
                <span key={i}>{line}{i < cfg.heroSubtitle.split('\n').length - 1 && <br />}</span>
              ))}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              <Link href="/works" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                작품 보기
              </Link>
              <Link href="/contact" className="btn-secondary">
                프로젝트 문의
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#22223A] w-full">
              {[
                { num: cfg.statClients, label: "고객사" },
                { num: cfg.statVideos,  label: "제작 영상" },
                { num: cfg.statTeam,    label: "전문 팀원" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text">{num}</div>
                  <div className="text-xs sm:text-sm text-[#888899] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Showreel card (데스크톱만) */}
          <div className="relative hidden lg:block lg:col-span-3">
            <div className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="video-wrapper">
                <iframe
                  src={showreelEmbedUrl ? `${showreelEmbedUrl}&background=1&autoplay=1&loop=1&muted=1` : 'about:blank'}
                  allow="autoplay; fullscreen; picture-in-picture"
                  style={{ border: 0 }}
                  title="BORAMEDIA Showreel"
                />
              </div>
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-semibold text-white">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                SHOWREEL 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-bounce-slow">
        <span className="text-xs text-[#888899] tracking-widest animate-pulse">SCROLL</span>
        <div className="relative w-5 h-8 rounded-full border border-[#888899]/50">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 rounded-full bg-[#888899] animate-scroll-dot" />
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888899" strokeWidth="2" className="animate-pulse opacity-60">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
