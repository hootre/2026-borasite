'use client';

import { useState, useRef, useCallback } from 'react';

type UploadStatus = 'idle' | 'preparing' | 'uploading' | 'done' | 'error';

interface UploadResult {
  videoId: string;
  vimeoLink: string;
}

// ─── tus 업로드 (라이브러리 없는 직접 구현) ─────────────────────────────────
async function tusUpload(
  file: File,
  uploadUrl: string,
  onProgress: (percent: number) => void
): Promise<void> {
  const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB 청크
  let offset = 0;

  // 현재 오프셋 확인 (재시작 지원)
  const headRes = await fetch(uploadUrl, {
    method: 'HEAD',
    headers: {
      'Tus-Resumable': '1.0.0',
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
  });
  if (headRes.ok) {
    const uploadOffset = headRes.headers.get('Upload-Offset');
    if (uploadOffset) offset = parseInt(uploadOffset, 10);
  }

  // 청크 단위로 업로드
  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const chunk = file.slice(offset, end);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PATCH', uploadUrl);
      xhr.setRequestHeader('Tus-Resumable', '1.0.0');
      xhr.setRequestHeader('Upload-Offset', String(offset));
      xhr.setRequestHeader('Content-Type', 'application/offset+octet-stream');
      xhr.setRequestHeader('Content-Length', String(chunk.size));
      xhr.setRequestHeader('Accept', 'application/vnd.vimeo.*+json;version=3.4');

      xhr.onload = () => {
        if (xhr.status === 204 || xhr.status === 200) {
          const newOffset = xhr.getResponseHeader('Upload-Offset');
          offset = newOffset ? parseInt(newOffset, 10) : end;
          onProgress(Math.round((offset / file.size) * 100));
          resolve();
        } else {
          reject(new Error(`업로드 청크 오류: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('네트워크 오류'));
      xhr.send(chunk);
    });
  }
}

// ─── 파일 크기 포맷 ──────────────────────────────────────────────────────────
function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// ─── Main Upload Section ──────────────────────────────────────────────────────
export default function UploadSection({ hasToken = false }: { hasToken?: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'disable' | 'anybody' | 'password'>('disable');
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState('');
  const [scopeError, setScopeError] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
    setError('');
    setScopeError(false);
    setResult(null);
    setStatus('idle');
    setProgress(0);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('video/')) handleFile(dropped);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus('preparing');
    setError('');
    setScopeError(false);

    try {
      // 1. 업로드 티켓 생성
      const ticketRes = await fetch('/api/vimeo-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: title || file.name, description, size: file.size, privacy, tags: tagList }),
      });

      const ticketData = await ticketRes.json();

      if (!ticketRes.ok) {
        if (ticketData.error === 'UPLOAD_SCOPE_REQUIRED') {
          setScopeError(true);
          setStatus('error');
          return;
        }
        throw new Error(ticketData.message || ticketData.error || '티켓 생성 실패');
      }

      const { uploadUrl, videoId, vimeoLink } = ticketData;

      // 2. tus 업로드 실행
      setStatus('uploading');
      setProgress(0);
      await tusUpload(file, uploadUrl, setProgress);

      // 3. 완료
      setStatus('done');
      setProgress(100);
      setResult({ videoId, vimeoLink });

    } catch (err: any) {
      setStatus('error');
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  const reset = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setTagList([]);
    setTagInput('');
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError('');
    setScopeError(false);
  };

  return (
    <div className="space-y-5">

      {/* Upload 스코프 필요 안내 — 토큰이 없을 때만 표시 */}
      {!hasToken && <div className="rounded-xl border border-blue-500/30 bg-blue-500/8 px-5 py-4 flex items-start gap-3">
        <svg className="shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div className="text-sm">
          <p className="text-blue-400 font-semibold mb-1">업로드 전 확인 — Vimeo 토큰 권한 필요</p>
          <p className="text-blue-400/70 text-xs leading-relaxed">
            업로드 기능은 <strong className="text-blue-300">upload</strong> 스코프가 포함된 액세스 토큰이 필요합니다.{' '}
            <a href="https://developer.vimeo.com/apps" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-blue-300">
              Vimeo 개발자 페이지
            </a>에서 앱 → Edit → Authentication → Generate new token 클릭 후{' '}
            <strong className="text-blue-300">upload</strong> 체크박스를 선택하고 생성한 토큰을{' '}
            .env.local의 <code className="bg-white/10 px-1 rounded">VIMEO_ACCESS_TOKEN</code>에 입력하세요.
          </p>
        </div>
      </div>}

      {/* Upload 스코프 오류 */}
      {scopeError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4">
          <p className="text-red-400 font-semibold text-sm mb-1">❌ upload 권한 없음</p>
          <p className="text-red-400/70 text-xs">
            현재 토큰에 upload 스코프가 없습니다. 위 안내에 따라 새 토큰을 생성하고 서버를 재시작한 뒤 다시 시도하세요.
          </p>
        </div>
      )}

      {/* 완료 결과 */}
      {status === 'done' && result && (
        <div className="rounded-xl border border-green-500/40 bg-green-500/8 px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p className="text-green-400 font-bold">업로드 완료!</p>
          </div>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex gap-3 items-center">
              <span className="text-[#888899] w-24">Vimeo ID</span>
              <code className="text-white bg-white/5 px-2 py-1 rounded-lg">{result.videoId}</code>
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-[#888899] w-24">Vimeo 링크</span>
              <a href={result.vimeoLink} target="_blank" rel="noopener noreferrer"
                className="text-[#7B5EA7] hover:text-purple-300 underline text-xs">{result.vimeoLink}</a>
            </div>
          </div>
          <p className="text-xs text-[#555566] mb-4">
            Vimeo에서 영상 처리 완료 후(수 분 소요) 사이트에 자동 반영됩니다. 서버 재시작 또는 1시간 후 캐시가 갱신됩니다.
          </p>
          <button onClick={reset}
            className="text-sm text-[#888899] hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-lg">
            새 영상 업로드
          </button>
        </div>
      )}

      {/* 업로드 폼 */}
      {status !== 'done' && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 space-y-5">

          {/* 파일 드롭존 */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed transition-all py-10 flex flex-col items-center justify-center gap-3
              ${dragging ? 'border-[#7B5EA7] bg-[#7B5EA7]/10' : file ? 'border-green-500/50 bg-green-500/5' : 'border-white/15 hover:border-[#7B5EA7]/50 hover:bg-white/3'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            {file ? (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <p className="text-white font-semibold text-sm">{file.name}</p>
                <p className="text-[#888899] text-xs">{formatSize(file.size)}</p>
                <p className="text-[#555566] text-xs">클릭하여 다른 파일 선택</p>
              </>
            ) : (
              <>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7B5EA7" strokeWidth="1.5">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
                <p className="text-white text-sm font-semibold">영상 파일을 드래그하거나 클릭하여 선택</p>
                <p className="text-[#555566] text-xs">MP4, MOV, AVI 등 모든 동영상 형식 지원</p>
              </>
            )}
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-xs text-[#888899] mb-2">영상 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="영상 제목 입력"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555566] outline-none focus:border-[#7B5EA7]/60"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-xs text-[#888899] mb-2">설명 (선택)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="영상 설명을 입력하세요"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555566] outline-none focus:border-[#7B5EA7]/60 resize-none"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-xs text-[#888899] mb-2">
              태그 <span className="text-[#555566]">(Enter로 추가)</span>
            </label>
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#555566] outline-none focus:border-[#7B5EA7]/60"
            />
            <p className="text-[10px] text-[#555566] mt-1">
              카테고리: 기업홍보·이벤트·뮤직비디오·광고·드라마·촬영 | 날짜: YYMMDD (예: 260413)
            </p>
          </div>

          {/* 공개 설정 */}
          <div>
            <label className="block text-xs text-[#888899] mb-2">공개 범위</label>
            <div className="flex gap-2">
              {[
                { value: 'disable', label: '🔒 비공개', desc: '링크 공유 불가' },
                { value: 'anybody', label: '🌐 공개', desc: '누구나 검색·시청 가능' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPrivacy(value as any)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition-all text-left
                    ${privacy === value ? 'border-[#7B5EA7]/60 bg-[#7B5EA7]/10 text-white' : 'border-white/10 text-[#888899] hover:border-white/20'}`}
                >
                  <p className="font-semibold">{label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 진행 바 */}
          {(status === 'uploading' || status === 'preparing') && (
            <div>
              <div className="flex justify-between text-xs text-[#888899] mb-2">
                <span>{status === 'preparing' ? '업로드 준비 중...' : `업로드 중... ${progress}%`}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #7B5EA7, #9B6EC7)',
                  }}
                />
              </div>
            </div>
          )}

          {/* 에러 */}
          {status === 'error' && error && (
            <p className="text-red-400 text-sm">❌ {error}</p>
          )}

          {/* 업로드 버튼 */}
          <button
            onClick={handleUpload}
            disabled={!file || status === 'uploading' || status === 'preparing'}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
              ${file && status !== 'uploading' && status !== 'preparing'
                ? 'text-white cursor-pointer hover:opacity-90'
                : 'text-white/30 cursor-not-allowed bg-white/5'}`}
            style={file && status !== 'uploading' && status !== 'preparing'
              ? { background: 'linear-gradient(135deg, #7B5EA7, #9B6EC7)' }
              : {}}
          >
            {status === 'preparing' || status === 'uploading' ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                {status === 'preparing' ? '준비 중...' : `업로드 중 ${progress}%`}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
                Vimeo에 업로드
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
