'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WorkMeta, CATEGORY_LABELS } from '@/lib/types';
import { logoutAction } from './actions';
import EditModal from './EditModal';
import UploadSection from './UploadSection';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Stats {
  total: number;
  byCategory: Record<string, number>;
  vimeoConnected: boolean;
}

type Tab = 'works' | 'upload' | 'settings';

// ─── Category color map ──────────────────────────────────────────────────────

const CAT_COLORS: Record<string, string> = {
  corporate: 'text-blue-400 bg-blue-400/10',
  music: 'text-pink-400 bg-pink-400/10',
  filming: 'text-cyan-400 bg-cyan-400/10',
  sketch: 'text-green-400 bg-green-400/10',
  youtube: 'text-red-400 bg-red-400/10',
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

function DeleteConfirm({
  work,
  onCancel,
  onConfirm,
  deleting,
  error,
}: {
  work: WorkMeta;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
  error: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-red-500/20 shadow-2xl p-6"
        style={{ background: '#12121E' }}>
        <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </div>
        <h3 className="text-center text-white font-bold mb-2">영상 삭제</h3>
        <p className="text-center text-[#888899] text-sm mb-1">
          <span className="text-white font-semibold">"{work.title}"</span>
        </p>
        <p className="text-center text-[#555566] text-xs mb-5">
          Vimeo에서 영구 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-xs text-red-400">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-[#888899] hover:text-white transition-all">
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                삭제 중...
              </>
            ) : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: {
  label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <p className="text-xs text-[#888899] mb-1">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-[#555566] mt-1">{sub}</p>}
    </div>
  );
}

// ─── Works Table ─────────────────────────────────────────────────────────────

function WorksTable({
  works,
  onEdit,
  onDelete,
}: {
  works: WorkMeta[];
  onEdit: (work: WorkMeta) => void;
  onDelete: (work: WorkMeta) => void;
}) {
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState('all');

  // 태그에서 YYMMDD 날짜의 연도(20YY) 추출
  const getTagYear = (tags: string[]): string | null => {
    const dateTag = tags.find((t) => /^\d{6}$/.test(t));
    if (!dateTag) return null;
    return '20' + dateTag.slice(0, 2);
  };

  // 전체 작품에서 연도 목록 추출 (중복 제거, 최신순)
  const years = Array.from(new Set(works.map((w) => getTagYear(w.tags)).filter(Boolean) as string[])).sort((a, b) => b.localeCompare(a));

  const filtered = works.filter((w) => {
    const matchYear = filterYear === 'all' || getTagYear(w.tags) === filterYear;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      w.title.toLowerCase().includes(q) ||
      w.client.toLowerCase().includes(q) ||
      w.vimeoId.includes(q);
    return matchYear && matchSearch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555566]" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제목 · 클라이언트 · Vimeo ID 검색"
            className="w-full pl-9 pr-4 bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-white placeholder-[#555566] outline-none focus:border-[#7B5EA7]/60"
          />
        </div>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#7B5EA7]/60"
        >
          <option value="all">전체 연도</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 overflow-hidden">
        {/* Header */}
        <div className="hidden lg:grid grid-cols-[64px_1fr_130px_1fr_110px] gap-4 px-5 py-3 bg-white/3 border-b border-white/8 text-xs text-[#555566]">
          <span>썸네일</span>
          <span>제목 / 클라이언트</span>
          <span>Vimeo ID</span>
          <span>태그</span>
          <span>관리</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#555566] text-sm">검색 결과 없음</div>
        ) : (
          filtered.map((work, i) => (
            <div
              key={work.id}
              className={`grid grid-cols-[64px_1fr] lg:grid-cols-[64px_1fr_130px_1fr_110px] gap-4 items-center px-5 py-3.5
                ${i % 2 === 0 ? '' : 'bg-white/2'}
                border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group`}
            >
              {/* Thumbnail */}
              <div className="relative w-16 aspect-video rounded-lg overflow-hidden bg-white/5 shrink-0">
                {work.thumbnail && !work.thumbnail.includes('default_1280') ? (
                  <Image src={work.thumbnail} alt={work.title} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#333344">
                      <rect x="2" y="3" width="20" height="18" rx="2" /><polygon points="10 8 16 12 10 16 10 8" fill="#888899" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title / client */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate group-hover:text-purple-200 transition-colors">
                  {work.title}
                </p>
                <p className="text-xs text-[#7B5EA7] mt-0.5 truncate">{work.client}</p>
                {/* Mobile info */}
                <div className="flex gap-1.5 mt-1 lg:hidden flex-wrap">
                  {work.tags.length > 0 ? [...work.tags].sort((a, b) => {
                    const aIsDate = /^\d{6}$/.test(a);
                    const bIsDate = /^\d{6}$/.test(b);
                    if (aIsDate && !bIsDate) return -1;
                    if (!aIsDate && bIsDate) return 1;
                    return 0;
                  }).map((tag, idx) => (
                    <span key={idx} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${/^\d{6}$/.test(tag) ? 'bg-blue-500/15 text-blue-400' : 'bg-[#7B5EA7]/15 text-[#c4a8e6]'}`}>
                      {tag}
                    </span>
                  )) : (
                    <span className="text-[10px] text-[#444455]">태그 없음</span>
                  )}
                  <code className="text-[10px] text-[#444455]">{work.vimeoId}</code>
                </div>
                {/* Mobile actions */}
                <div className="flex gap-2 mt-2 lg:hidden">
                  <button onClick={() => onEdit(work)}
                    className="text-xs text-[#888899] hover:text-white border border-white/10 hover:border-white/20 px-2 py-1 rounded-lg transition-all">
                    수정
                  </button>
                  <a href={`/works/${work.slug}`} target="_blank"
                    className="text-xs text-[#888899] hover:text-white border border-white/10 hover:border-white/20 px-2 py-1 rounded-lg transition-all">
                    보기
                  </a>
                  <a href={`https://vimeo.com/${work.vimeoId}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#888899] hover:text-[#7B5EA7] border border-white/10 hover:border-[#7B5EA7]/30 px-2 py-1 rounded-lg transition-all">
                    Vimeo
                  </a>
                  <button onClick={() => onDelete(work)}
                    className="text-xs text-red-400/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2 py-1 rounded-lg transition-all">
                    삭제
                  </button>
                </div>
              </div>

              {/* Vimeo ID */}
              <code className="hidden lg:block text-xs text-[#555566] font-mono bg-white/3 px-2 py-1 rounded-lg truncate">
                {work.vimeoId}
              </code>

              {/* Tags — 날짜(숫자6자리) 우선 정렬 */}
              <div className="hidden lg:flex flex-wrap gap-1 min-w-0">
                {work.tags.length > 0 ? [...work.tags].sort((a, b) => {
                  const aIsDate = /^\d{6}$/.test(a);
                  const bIsDate = /^\d{6}$/.test(b);
                  if (aIsDate && !bIsDate) return -1;
                  if (!aIsDate && bIsDate) return 1;
                  return 0;
                }).map((tag, idx) => (
                  <span key={idx} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap ${/^\d{6}$/.test(tag) ? 'bg-blue-500/15 text-blue-400' : 'bg-[#7B5EA7]/15 text-[#c4a8e6]'}`}>
                    {tag}
                  </span>
                )) : (
                  <span className="text-[10px] text-[#444455]">태그 없음</span>
                )}
              </div>

              {/* Actions (desktop) */}
              <div className="hidden lg:flex gap-1.5 items-center">
                <button
                  onClick={() => onEdit(work)}
                  title="수정"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#888899] hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <a
                  href={`/works/${work.slug}`}
                  target="_blank"
                  title="사이트에서 보기"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#888899] hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </a>
                <a
                  href={`https://vimeo.com/${work.vimeoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Vimeo에서 보기"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#888899] hover:text-[#7B5EA7] hover:bg-[#7B5EA7]/10 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 7.286c-.1 2.188-1.624 5.183-4.574 8.988C15.488 20.253 12.928 22 10.755 22c-1.33 0-2.455-1.23-3.374-3.687L5.56 12.59C4.877 10.132 4.147 8.9 3.37 8.9c-.16 0-.72.338-1.68 1.01L.5 8.502c1.056-.929 2.097-1.857 3.12-2.786C5.03 4.417 6.11 3.819 6.87 3.75c1.84-.177 2.972 1.08 3.397 3.77.457 2.89.773 4.687.95 5.387.527 2.395 1.105 3.59 1.734 3.59.49 0 1.228-.775 2.212-2.326.984-1.55 1.51-2.73 1.576-3.538.14-1.336-.386-2.007-1.576-2.007-.562 0-1.14.129-1.734.384 1.15-3.765 3.347-5.594 6.59-5.486C22.043 3.577 23.1 4.886 23 7.286z" />
                  </svg>
                </a>
                <button
                  onClick={() => onDelete(work)}
                  title="삭제"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555566] hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-[#444455] text-right mt-3">
        {filtered.length}개 표시 중 (전체 {works.length}개)
      </p>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function AdminDashboard({
  works: initialWorks,
  stats,
  hasToken = false,
}: {
  works: WorkMeta[];
  stats: Stats;
  hasToken?: boolean;
}) {
  const [works, setWorks] = useState<WorkMeta[]>(initialWorks);
  const [tab, setTab] = useState<Tab>('works');
  const [editingWork, setEditingWork] = useState<WorkMeta | null>(null);
  const [deletingWork, setDeletingWork] = useState<WorkMeta | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // ── 수정 저장
  const handleSave = (updated: Partial<WorkMeta>) => {
    if (!editingWork) return;
    setWorks((prev) =>
      prev.map((w) => (w.id === editingWork.id ? { ...w, ...updated } : w))
    );
  };

  // ── 삭제 실행
  const handleDelete = async () => {
    if (!deletingWork) return;
    setDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch(`/api/vimeo-video/${deletingWork.vimeoId}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes('SCOPE')) {
          setDeleteError('현재 토큰에 delete 권한이 없습니다. Vimeo 개발자 페이지에서 delete 스코프가 포함된 토큰을 재발급하세요.');
        } else {
          setDeleteError(data.message || data.error || '삭제 실패');
        }
        return;
      }

      // 로컬 상태에서 제거
      setWorks((prev) => prev.filter((w) => w.id !== deletingWork.id));
      setDeletingWork(null);
    } catch (e: any) {
      setDeleteError('네트워크 오류: ' + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const currentStats = {
    ...stats,
    total: works.length,
    byCategory: {
      corporate: works.filter((w) => w.category === 'corporate').length,
      music: works.filter((w) => w.category === 'music').length,
      filming: works.filter((w) => w.category === 'filming').length,
      sketch: works.filter((w) => w.category === 'sketch').length,
      youtube: works.filter((w) => w.category === 'youtube').length,
    },
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'works', label: `작품 관리 (${works.length})` },
    { key: 'upload', label: '영상 업로드' },
    { key: 'settings', label: '설정' },
  ];

  return (
    <>
      {/* Modals */}
      {editingWork && (
        <EditModal
          work={editingWork}
          onClose={() => setEditingWork(null)}
          onSave={(updated) => { handleSave(updated); setEditingWork(null); }}
        />
      )}
      {deletingWork && (
        <DeleteConfirm
          work={deletingWork}
          onCancel={() => { setDeletingWork(null); setDeleteError(''); setDeleting(false); }}
          onConfirm={handleDelete}
          deleting={deleting}
          error={deleteError}
        />
      )}

      {/* Layout */}
      <div className="min-h-screen" style={{ background: '#0A0A14' }}>

        {/* Top nav */}
        <header className="border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md"
          style={{ background: 'rgba(10,10,20,0.9)' }}>
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7B5EA7, #9B6EC7)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-black text-white text-lg">BORAMEDIA</span>
            <span className="text-[#555566] text-sm hidden sm:block">/ Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank"
              className="hidden sm:flex items-center gap-1 text-xs text-[#888899] hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/15">
              사이트 보기
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </Link>
            <form action={logoutAction}>
              <button type="submit"
                className="text-xs text-[#888899] hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-white/8 hover:border-red-400/30">
                로그아웃
              </button>
            </form>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white">대시보드</h1>
            <p className="text-[#888899] text-sm mt-1">보라미디어 관리 패널</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="전체 작품" value={currentStats.total} sub="Vimeo 연동" color="text-white" />
            <StatCard
              label="API 상태"
              value={currentStats.vimeoConnected ? '연결됨' : '샘플'}
              sub={currentStats.vimeoConnected ? '실시간 연동' : '토큰 확인 필요'}
              color={currentStats.vimeoConnected ? 'text-green-400' : 'text-yellow-400'}
            />
            <StatCard
              label="광고/홍보"
              value={`${currentStats.byCategory.corporate}`}
              color="text-blue-400"
            />
            <StatCard
              label="뮤직 / 촬영 / 스케치 / 유튜브"
              value={`${currentStats.byCategory.music} / ${currentStats.byCategory.filming} / ${currentStats.byCategory.sketch} / ${currentStats.byCategory.youtube}`}
              color="text-pink-400"
            />
          </div>

          {/* API 미연결 경고 */}
          {!currentStats.vimeoConnected && (
            <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/8 px-5 py-4 flex gap-3">
              <svg className="shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <p className="text-yellow-400 text-sm font-semibold">Vimeo API 미연결 — 샘플 데이터 표시 중</p>
                <p className="text-yellow-400/70 text-xs mt-0.5">
                  .env.local의 <code className="bg-white/10 px-1 rounded">VIMEO_ACCESS_TOKEN</code>,{' '}
                  <code className="bg-white/10 px-1 rounded">VIMEO_USER_ID=225257452</code> 확인 후 서버 재시작
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/8 mb-6">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 -mb-px
                  ${tab === key ? 'text-white border-[#7B5EA7]' : 'text-[#888899] border-transparent hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Works Tab ── */}
          {tab === 'works' && (
            <WorksTable
              works={works}
              onEdit={setEditingWork}
              onDelete={(work) => { setDeletingWork(work); setDeleteError(''); }}
            />
          )}

          {/* ── Upload Tab ── */}
          {tab === 'upload' && (
            <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white">영상 업로드</h2>
                <p className="text-[#888899] text-sm mt-1">Vimeo 계정에 영상을 업로드합니다.</p>
              </div>
              <UploadSection hasToken={hasToken} />
            </div>
          )}

          {/* ── Settings Tab ── */}
          {tab === 'settings' && (
            <div className="grid gap-5 max-w-2xl">

              {/* API 설정 */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B5EA7" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  Vimeo API 설정
                </h2>
                <div className="space-y-3 text-sm mb-5">
                  {[
                    { label: 'API 연결', value: currentStats.vimeoConnected ? '● 연결됨' : '○ 미연결', color: currentStats.vimeoConnected ? 'text-green-400' : 'text-yellow-400' },
                    { label: '사용자 ID', value: '225257452', color: 'text-white' },
                    { label: '작품 수', value: `${currentStats.total}개`, color: 'text-white' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                      <span className="text-[#888899]">{label}</span>
                      <span className={`font-semibold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 font-mono text-xs text-[#888899] space-y-1">
                  <p><span className="text-[#7B5EA7]">VIMEO_ACCESS_TOKEN</span>=<span className="text-[#444455]">••••••••••</span></p>
                  <p><span className="text-[#7B5EA7]">VIMEO_USER_ID</span>=225257452</p>
                  <p><span className="text-[#7B5EA7]">ADMIN_PASSWORD</span>=<span className="text-[#444455]">••••••••</span></p>
                </div>
              </div>

              {/* 필요 스코프 */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B5EA7" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Vimeo 토큰 스코프 안내
                </h2>
                <p className="text-sm text-[#888899] mb-4">
                  CRUD 기능 전부 사용하려면 아래 스코프가 모두 포함된 토큰이 필요합니다.{' '}
                  <a href="https://developer.vimeo.com/apps" target="_blank" rel="noopener noreferrer"
                    className="text-[#7B5EA7] hover:text-purple-300 underline">
                    Vimeo 개발자 페이지 →
                  </a>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { scope: 'public', desc: '공개 영상 조회 (Read)', required: true },
                    { scope: 'private', desc: '비공개 영상 조회', required: false },
                    { scope: 'upload', desc: '영상 업로드 (Create)', required: true },
                    { scope: 'edit', desc: '영상 정보 수정 (Update)', required: true },
                    { scope: 'delete', desc: '영상 삭제 (Delete)', required: true },
                  ].map(({ scope, desc, required }) => (
                    <div key={scope}
                      className={`rounded-xl border p-3 ${required ? 'border-[#7B5EA7]/30 bg-[#7B5EA7]/8' : 'border-white/8 bg-white/3'}`}>
                      <code className={`text-xs font-bold ${required ? 'text-[#9B6EC7]' : 'text-[#888899]'}`}>{scope}</code>
                      <p className="text-[10px] text-[#555566] mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 페이지 구조 */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B5EA7" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  페이지 구조
                </h2>
                <div className="space-y-1">
                  {[
                    { path: '/', label: '홈 (메인)' },
                    { path: '/works', label: 'Works — 전체 작품' },
                    { path: '/about', label: 'About' },
                    { path: '/contact', label: 'Contact' },
                    { path: '/admin', label: 'Admin ★ 현재 페이지' },
                  ].map(({ path, label }) => (
                    <div key={path} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                      <code className="text-xs text-[#7B5EA7] bg-[#7B5EA7]/10 px-2 py-1 rounded-lg w-24 shrink-0">{path}</code>
                      <p className="text-sm text-[#888899] flex-1">{label}</p>
                      <Link href={path} target="_blank" className="text-[#444455] hover:text-white transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
