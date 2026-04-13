'use client';

import { useState, useEffect, useRef } from 'react';
import { WorkMeta } from '@/lib/types';

interface Props {
  work: WorkMeta;
  onClose: () => void;
  onSave: (updated: Partial<WorkMeta>) => void;
}

export default function EditModal({ work, onClose, onSave }: Props) {
  const [name, setName] = useState(work.title);
  const [description, setDescription] = useState(work.description || '');
  const [privacy, setPrivacy] = useState<'anybody' | 'disable'>('disable');
  const [tagList, setTagList] = useState<string[]>(work.tags);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  // ESC 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = async () => {
    if (!name.trim()) { setError('제목을 입력하세요.'); return; }
    setSaving(true);
    setError('');

    const tagArray = tagList;

    try {
      const res = await fetch(`/api/vimeo-video/${work.vimeoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, privacy, tags: tagArray }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'EDIT_SCOPE_REQUIRED') {
          setError('현재 토큰에 edit 권한이 없습니다. Vimeo 개발자 페이지에서 edit 스코프가 포함된 토큰을 재발급하세요.');
        } else {
          setError(data.message || data.error || '저장 실패');
        }
        return;
      }

      onSave({ title: name, description, tags: tagArray });

      if (data.tagWarning) {
        alert(data.tagWarning);
      }

      onClose();
    } catch (e: any) {
      setError('네트워크 오류: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onMouseDown={(e) => { mouseDownTarget.current = e.target; }}
      onMouseUp={(e) => {
        if (e.target === overlayRef.current && mouseDownTarget.current === overlayRef.current) {
          onClose();
        }
        mouseDownTarget.current = null;
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: '#12121E' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h2 className="text-base font-bold text-white">영상 정보 수정</h2>
            <p className="text-xs text-[#555566] mt-0.5">Vimeo ID: {work.vimeoId}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#888899] hover:text-white hover:bg-white/10 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-xs text-[#888899] mb-1.5">영상 제목 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-xs text-[#888899] mb-1.5">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all resize-none"
            />
          </div>

          {/* 태그 (카테고리 자동 감지에 사용) */}
          <div>
            <label className="block text-xs text-[#888899] mb-1.5">
              태그 <span className="text-[#444455]">(Enter로 추가 · 카테고리/날짜 자동 감지에 사용)</span>
            </label>
            {/* 저장된 태그 칩 */}
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tagList.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-[#7B5EA7]/20 border border-[#7B5EA7]/30 text-[#c4a8e6] text-xs font-medium px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTagList(tagList.filter((_, idx) => idx !== i))}
                      className="text-[#888899] hover:text-white ml-0.5 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = tagInput.trim();
                  if (val && !tagList.includes(val)) {
                    setTagList([...tagList, val]);
                  }
                  setTagInput('');
                }
                if (e.key === 'Backspace' && !tagInput && tagList.length > 0) {
                  setTagList(tagList.slice(0, -1));
                }
              }}
              placeholder="태그 입력 후 Enter"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60 transition-all placeholder-[#444455]"
            />
            <p className="text-[10px] text-[#444455] mt-1">
              카테고리: 기업홍보·뮤직비디오·광고·촬영·현장스케치·유튜브 | 날짜: YYMMDD (예: 260413) | Backspace로 마지막 태그 삭제
            </p>
          </div>

          {/* 공개 범위 */}
          <div>
            <label className="block text-xs text-[#888899] mb-1.5">공개 범위</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'disable', label: '🔒 비공개', desc: '링크 없이 접근 불가' },
                { value: 'anybody', label: '🌐 공개', desc: '누구나 시청 가능' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPrivacy(value as any)}
                  className={`rounded-xl border p-3 text-left transition-all
                    ${privacy === value
                      ? 'border-[#7B5EA7]/60 bg-[#7B5EA7]/10'
                      : 'border-white/10 hover:border-white/20'}`}
                >
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-[10px] text-[#555566] mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-white/8">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-[#888899] hover:text-white hover:border-white/20 transition-all">
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7B5EA7, #9B6EC7)' }}
          >
            {saving ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                저장 중...
              </>
            ) : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
