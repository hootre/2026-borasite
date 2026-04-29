'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { WorkMeta } from '@/lib/types';
import { WorkLinks } from '@/lib/workLinksTypes';

interface Props {
  works: WorkMeta[];
}

export default function WorkLinksEditor({ works }: Props) {
  const [links, setLinks] = useState<WorkLinks>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/worklinks')
      .then((r) => r.json())
      .then((data) => { setLinks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/worklinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links),
      });
      setMsg(res.ok
        ? { type: 'success', text: '✓ 저장됐습니다. 영상 상세 페이지에 즉시 반영됩니다.' }
        : { type: 'error', text: '저장 실패. 다시 시도해주세요.' });
    } catch {
      setMsg({ type: 'error', text: '네트워크 오류' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const setField = (vimeoId: string, field: 'url' | 'text', value: string) => {
    setLinks((prev) => ({
      ...prev,
      [vimeoId]: { ...prev[vimeoId], [field]: value },
    }));
  };

  const clearWork = (vimeoId: string) => {
    setLinks((prev) => {
      const next = { ...prev };
      delete next[vimeoId];
      return next;
    });
  };

  const filtered = works.filter((w) => {
    const q = search.toLowerCase();
    return !search || w.title.toLowerCase().includes(q) || w.client.toLowerCase().includes(q);
  });

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
    <div className="max-w-3xl space-y-6">
      {/* 안내 */}
      <div className="rounded-xl border border-[#7B5EA7]/20 bg-[#7B5EA7]/8 px-5 py-4 text-sm text-purple-300">
        각 영상 상세 페이지의 <strong>버튼 링크</strong>와 <strong>버튼 텍스트</strong>를 수정합니다.<br />
        <span className="text-purple-400/70 text-xs mt-1 block">비워두면 기본값 (Vimeo 링크 / "Vimeo에서 보기") 으로 표시됩니다.</span>
      </div>

      {/* 검색 */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555566]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제목 · 클라이언트 검색"
          className="w-full pl-9 pr-4 bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-white placeholder-[#555566] outline-none focus:border-[#7B5EA7]/60"
        />
      </div>

      {/* 목록 */}
      <div className="space-y-3">
        {filtered.map((work) => {
          const override = links[work.vimeoId] ?? {};
          const hasOverride = override.url || override.text;
          return (
            <div
              key={work.id}
              className={`rounded-2xl border p-5 transition-all ${hasOverride ? 'border-[#7B5EA7]/30 bg-[#7B5EA7]/5' : 'border-white/8 bg-white/2'}`}
            >
              {/* 작품 정보 헤더 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-14 aspect-video rounded-lg overflow-hidden bg-white/5 shrink-0">
                  {work.thumbnail && !work.thumbnail.includes('default_1280') ? (
                    <Image src={work.thumbnail} alt={work.title} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#333344">
                        <rect x="2" y="3" width="20" height="18" rx="2" /><polygon points="10 8 16 12 10 16 10 8" fill="#888899" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{work.title}</p>
                  <p className="text-xs text-[#7B5EA7] mt-0.5 truncate">{work.client}</p>
                </div>
                {hasOverride && (
                  <button
                    onClick={() => clearWork(work.vimeoId)}
                    title="기본값으로 초기화"
                    className="text-[10px] text-[#555566] hover:text-red-400 px-2 py-1 rounded-lg border border-white/8 hover:border-red-400/30 transition-all shrink-0"
                  >
                    초기화
                  </button>
                )}
              </div>

              {/* 편집 필드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#555566] mb-1.5 font-medium">
                    버튼 링크 URL
                    <span className="text-[#444455] ml-1">기본: vimeo.com/{work.vimeoId}</span>
                  </label>
                  <input
                    type="url"
                    value={override.url ?? ''}
                    onChange={(e) => setField(work.vimeoId, 'url', e.target.value)}
                    placeholder={`https://vimeo.com/${work.vimeoId}`}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#333344] outline-none focus:border-[#7B5EA7]/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#555566] mb-1.5 font-medium">
                    버튼 텍스트
                    <span className="text-[#444455] ml-1">기본: Vimeo에서 보기</span>
                  </label>
                  <input
                    type="text"
                    value={override.text ?? ''}
                    onChange={(e) => setField(work.vimeoId, 'text', e.target.value)}
                    placeholder="Vimeo에서 보기"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#333344] outline-none focus:border-[#7B5EA7]/60 transition-all"
                  />
                </div>
              </div>

              {/* 미리보기 */}
              {hasOverride && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                  <span className="text-[10px] text-[#444455]">미리보기:</span>
                  <a
                    href={override.url || `https://vimeo.com/${work.vimeoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#9B72CF] hover:text-purple-300 border border-[#7B5EA7]/30 rounded-lg px-2.5 py-1 transition-colors"
                  >
                    {override.text || 'Vimeo에서 보기'}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[#555566] text-sm">검색 결과 없음</div>
        )}
      </div>

      {/* 저장 버튼 */}
      <div className="flex items-center gap-3 sticky bottom-6">
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
          ) : '전체 저장'}
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
