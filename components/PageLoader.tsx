'use client';

import { useState, useEffect } from 'react';

export default function PageLoader() {
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const hide = () => {
      setFadeOut(true);
      setTimeout(() => setHidden(true), 900);
    };

    // Vimeo 재생 시작 이벤트 수신
    window.addEventListener('vimeo-ready', hide);

    // 최대 6초 fallback (Vimeo 없거나 느린 환경)
    const fallback = setTimeout(hide, 6000);

    return () => {
      window.removeEventListener('vimeo-ready', hide);
      clearTimeout(fallback);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8"
      style={{
        background: '#0A0A14',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* 배경 오브 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7B5EA7 0%, transparent 70%)' }}
      />

      {/* 로고 + 스피너 */}
      <div className="relative flex flex-col items-center gap-6">
        {/* 로고 텍스트 */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7B5EA7, #9B6EC7)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span
            className="text-2xl font-black tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #9B72CF, #C9A84C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BORAMEDIA
          </span>
        </div>

        {/* 스피너 링 */}
        <div className="relative w-16 h-16">
          {/* 바깥 트랙 */}
          <svg className="absolute inset-0" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="rgba(123,94,167,0.15)" strokeWidth="3" />
          </svg>
          {/* 회전 호 */}
          <svg className="absolute inset-0 animate-spin" viewBox="0 0 64 64" fill="none" style={{ animationDuration: '1.2s' }}>
            <path
              d="M32 4 A28 28 0 0 1 60 32"
              stroke="url(#spinGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7B5EA7" />
                <stop offset="100%" stopColor="#C9A84C" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 로딩 텍스트 */}
      <p
        className="text-xs tracking-[0.3em] uppercase"
        style={{ color: 'rgba(136,136,153,0.6)' }}
      >
        Loading Showreel
      </p>
    </div>
  );
}
