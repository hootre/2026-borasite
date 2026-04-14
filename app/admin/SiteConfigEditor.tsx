'use client';

import { useState, useEffect } from 'react';
import { SiteConfig, DEFAULT_CONFIG } from '@/lib/siteConfigTypes';

export default function SiteConfigEditor() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => r.json())
      .then((data) => { setConfig({ ...DEFAULT_CONFIG, ...data }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setMsg({ type: 'success', text: '✓ 저장됐습니다. 홈페이지에 즉시 반영됩니다.' });
      } else {
        setMsg({ type: 'error', text: '저장 실패. 다시 시도해주세요.' });
      }
    } catch {
      setMsg({ type: 'error', text: '네트워크 오류' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const handleReset = () => {
    if (confirm('기본값으로 초기화하시겠습니까?')) setConfig({ ...DEFAULT_CONFIG });
  };

  const field = (
    key: keyof SiteConfig,
    label: string,
    hint?: string,
    multiline?: boolean
  ) => (
    <div key={key}>
      <label className="block text-xs text-[#888899] mb-1.5 font-medium">
        {label}
        {hint && <span className="text-[#444455] ml-2">{hint}</span>}
      </label>
      {multiline ? (
        <textarea
          value={config[key]}
          onChange={(e) => setConfig((p) => ({ ...p, [key]: e.target.value }))}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          value={config[key]}
          onChange={(e) => setConfig((p) => ({ ...p, [key]: e.target.value }))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all"
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin text-[#7B5EA7]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">

      {/* 히어로 섹션 */}
      <div className="rounded-2xl border border-white/8 bg-white/2 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-4 rounded-full" style={{ background: 'linear-gradient(#7B5EA7, #9B72CF)' }} />
          <h3 className="text-sm font-bold text-white">히어로 섹션</h3>
        </div>

        {field('heroBadge', '상단 뱃지 텍스트', '(자주색 알약 모양)')}

        <div className="space-y-3">
          <label className="block text-xs text-[#888899] font-medium">메인 타이틀</label>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-[#555566] mb-1 block">1번째 줄 (보라 그라디언트)</span>
              <input
                type="text"
                value={config.heroLine1}
                onChange={(e) => setConfig((p) => ({ ...p, heroLine1: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#555566] mb-1 block">2번째 줄 (흰색)</span>
              <input
                type="text"
                value={config.heroLine2}
                onChange={(e) => setConfig((p) => ({ ...p, heroLine2: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#555566] mb-1 block">3번째 줄 (골드 그라디언트)</span>
              <input
                type="text"
                value={config.heroLine3}
                onChange={(e) => setConfig((p) => ({ ...p, heroLine3: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all"
              />
            </div>
          </div>
        </div>

        {field('heroSubtitle', '부제목', '(줄바꿈: Enter)', true)}

        {/* 미리보기 */}
        <div className="mt-2 rounded-xl border border-white/5 bg-black/30 p-4">
          <p className="text-[10px] text-[#444455] mb-2 uppercase tracking-wider">미리보기</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-purple-500/20 text-[10px] text-purple-300 mb-2">
            <span className="w-1 h-1 rounded-full bg-purple-400" />
            {config.heroBadge || '...'}
          </div>
          <div className="text-lg font-black leading-tight">
            <span className="gradient-text block">{config.heroLine1 || '...'}</span>
            <span className="text-white block">{config.heroLine2 || '...'}</span>
            <span className="gradient-text-gold block">{config.heroLine3 || '...'}</span>
          </div>
          <p className="text-[#888899] text-xs mt-2 leading-relaxed whitespace-pre-line">{config.heroSubtitle}</p>
        </div>
      </div>

      {/* 통계 */}
      <div className="rounded-2xl border border-white/8 bg-white/2 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-4 rounded-full" style={{ background: 'linear-gradient(#C9A84C, #E8E8F0)' }} />
          <h3 className="text-sm font-bold text-white">통계 숫자</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {([
            ['statClients', '고객사'],
            ['statVideos',  '제작 영상'],
            ['statTeam',    '전문 팀원'],
          ] as [keyof SiteConfig, string][]).map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs text-[#888899] mb-1.5">{label}</label>
              <input
                type="text"
                value={config[key]}
                onChange={(e) => setConfig((p) => ({ ...p, [key]: e.target.value }))}
                placeholder="예: 137+"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white text-center font-bold outline-none focus:border-[#7B5EA7]/60 transition-all"
              />
            </div>
          ))}
        </div>
        {/* 통계 미리보기 */}
        <div className="grid grid-cols-3 gap-3 mt-1 pt-4 border-t border-white/5">
          {[
            { num: config.statClients, label: '고객사' },
            { num: config.statVideos,  label: '제작 영상' },
            { num: config.statTeam,    label: '전문 팀원' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black gradient-text">{num}</div>
              <div className="text-xs text-[#888899] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 카테고리 표시명 */}
      <div className="rounded-2xl border border-white/8 bg-white/2 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-4 rounded-full" style={{ background: 'linear-gradient(#3B82F6, #06B6D4)' }} />
          <h3 className="text-sm font-bold text-white">카테고리 표시명</h3>
          <span className="text-[10px] text-[#444455]">필터 버튼 · 영상 카드에 표시되는 이름</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([
            ['catAll',       '전체 (all)'],
            ['catCorporate', '광고/홍보'],
            ['catMusic',     '뮤직비디오'],
            ['catFilming',   '촬영'],
            ['catSketch',    '현장스케치'],
            ['catYoutube',   '유튜브'],
          ] as [keyof typeof config, string][]).map(([key, placeholder]) => (
            <div key={key}>
              <label className="block text-[10px] text-[#555566] mb-1">{placeholder}</label>
              <input
                type="text"
                value={config[key]}
                onChange={(e) => setConfig((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all"
              />
            </div>
          ))}
        </div>
        {/* 미리보기 */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
          {[
            config.catAll, config.catCorporate, config.catMusic,
            config.catFilming, config.catSketch, config.catYoutube,
          ].map((label, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium border ${i === 0 ? 'bg-[#7B5EA7] border-[#7B5EA7] text-white' : 'border-white/15 text-[#888899]'}`}>
              {label || '...'}
            </span>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7B5EA7, #9B6EC7)' }}
        >
          {saving ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              저장 중...
            </>
          ) : '홈페이지에 적용'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-3 rounded-xl border border-white/10 text-sm text-[#888899] hover:text-white hover:border-white/20 transition-all"
        >
          기본값
        </button>
      </div>

      {msg && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${
          msg.type === 'success'
            ? 'border-[#7B5EA7]/30 bg-[#7B5EA7]/10 text-purple-300'
            : 'border-red-500/30 bg-red-500/8 text-red-400'
        }`}>
          {msg.text}
        </div>
      )}
    </div>
  );
}
