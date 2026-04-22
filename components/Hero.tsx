"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteConfig, DEFAULT_CONFIG } from "@/lib/siteConfigTypes";

interface HeroProps {
  showreelEmbedUrl?: string | null;
  showreelThumbnail?: string | null;
  recentClients?: string[];
  siteConfig?: SiteConfig;
}

export default function Hero({ showreelEmbedUrl, showreelThumbnail, siteConfig }: HeroProps) {
  const cfg = siteConfig ?? DEFAULT_CONFIG;
  const textRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add("visible"), 100);
  }, []);

  // Vimeo postMessage로 실제 재생 시작 감지
  useEffect(() => {
    if (!showreelEmbedUrl) return;

    let fallbackTimer: ReturnType<typeof setTimeout>;

    const handleMessage = (e: MessageEvent) => {
      if (!e.origin.includes('vimeo.com')) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        // ready 또는 play 이벤트 수신 시 오버레이 제거
        if (data?.event === 'ready' || data?.event === 'play' || data?.event === 'playProgress') {
          setVideoReady(true);
          clearTimeout(fallbackTimer);
        }
      } catch {
        // parse 실패 무시
      }
    };

    window.addEventListener('message', handleMessage);

    // Vimeo postMessage가 안 오는 경우 대비 fallback (4초)
    fallbackTimer = setTimeout(() => setVideoReady(true), 4000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(fallbackTimer);
    };
  }, [showreelEmbedUrl]);

  const VideoWrapper = ({ mobile }: { mobile?: boolean }) => (
    <div className={`relative glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl ${mobile ? '' : ''}`}>
      <div className="video-wrapper relative">
        {/* 로딩 오버레이 */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            opacity: videoReady ? 0 : 1,
            pointerEvents: videoReady ? 'none' : 'auto',
            transition: 'opacity 0.8s ease',
          }}
        >
          {/* 썸네일 배경 */}
          {showreelThumbnail ? (
            <Image
              src={showreelThumbnail}
              alt="Showreel thumbnail"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 50%, #1A1A2E 100%)' }}
            />
          )}
          {/* 반투명 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/50" />
          {/* 스피너 */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="relative w-14 h-14">
              <svg className="absolute inset-0 animate-spin" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="24" stroke="rgba(123,94,167,0.3)" strokeWidth="3" />
                <path d="M28 4 A24 24 0 0 1 52 28" stroke="#9B72CF" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <span className="text-white/60 text-[11px] tracking-widest uppercase font-medium">
              Loading Showreel
            </span>
          </div>
        </div>

        {/* Vimeo iframe */}
        <iframe
          ref={iframeRef}
          src={showreelEmbedUrl
            ? `${showreelEmbedUrl}&background=1&autoplay=1&loop=1&muted=1`
            : 'about:blank'}
          allow="autoplay; fullscreen; picture-in-picture"
          style={{
            border: 0,
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
          title="BORAMEDIA Showreel"
        />
      </div>

      {/* SHOWREEL 뱃지 */}
      <div className="absolute top-4 left-4 inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-semibold text-white z-20">
        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        SHOWREEL 2026
      </div>
    </div>
  );

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
        style={{ background: "radial-gradient(circle, #7B5EA7 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-24 pb-24">

        {/* 모바일: showreel 상단 */}
        <div className="block lg:hidden mb-6">
          <VideoWrapper mobile />
        </div>

        {/* 데스크톱: 좌우 레이아웃 */}
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

          {/* Right: Showreel (데스크톱) */}
          <div className="relative hidden lg:block lg:col-span-3">
            <VideoWrapper />
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
