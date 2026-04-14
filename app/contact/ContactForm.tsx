'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      type:    (form.elements.namedItem('type')    as HTMLSelectElement).value,
      budget:  (form.elements.namedItem('budget')  as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/artinsky@boramedia.co.kr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: '[BORAMEDIA] 새 프로젝트 문의',
          _captcha: 'false',
        }),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#888899] mb-1.5 uppercase tracking-wider">
            이름 / 회사명 *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="홍길동 / (주)보라미디어"
            className="w-full bg-[#10101A] border border-[#22223A] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#444455] focus:outline-none focus:border-[#7B5EA7] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#888899] mb-1.5 uppercase tracking-wider">
            이메일 *
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="contact@company.com"
            className="w-full bg-[#10101A] border border-[#22223A] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#444455] focus:outline-none focus:border-[#7B5EA7] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#888899] mb-1.5 uppercase tracking-wider">
            프로젝트 유형
          </label>
          <select
            name="type"
            className="w-full bg-[#10101A] border border-[#22223A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#7B5EA7] transition-colors appearance-none cursor-pointer"
          >
            <option value="">선택하세요</option>
            <option value="corporate">광고/홍보 영상</option>
            <option value="music">뮤직비디오</option>
            <option value="filming">촬영</option>
            <option value="sketch">현장스케치</option>
            <option value="youtube">유튜브 콘텐츠</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#888899] mb-1.5 uppercase tracking-wider">
            예산 규모 (선택)
          </label>
          <select
            name="budget"
            className="w-full bg-[#10101A] border border-[#22223A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#7B5EA7] transition-colors appearance-none cursor-pointer"
          >
            <option value="">선택하세요</option>
            <option value="under_10m">1,000만원 미만</option>
            <option value="10m_30m">1,000 ~ 3,000만원</option>
            <option value="30m_50m">3,000 ~ 5,000만원</option>
            <option value="over_50m">5,000만원 이상</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#888899] mb-1.5 uppercase tracking-wider">
            프로젝트 내용 *
          </label>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="어떤 영상을 제작하고 싶으신지, 일정, 참고사항 등을 자유롭게 작성해주세요."
            className="w-full bg-[#10101A] border border-[#22223A] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#444455] focus:outline-none focus:border-[#7B5EA7] transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary w-full py-4 text-base disabled:opacity-60"
        >
          {status === 'sending' ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              전송 중...
            </>
          ) : (
            <>
              문의 보내기
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* ── 결과 팝업 ── */}
      {(status === 'success' || status === 'error') && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={() => setStatus('idle')}
        >
          <div
            className="w-full max-w-sm rounded-2xl border shadow-2xl p-8 text-center"
            style={{ background: '#12121E', borderColor: status === 'success' ? 'rgba(123,94,167,0.3)' : 'rgba(248,113,113,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {status === 'success' ? (
              <>
                {/* 성공 아이콘 */}
                <div className="w-16 h-16 rounded-full bg-[#7B5EA7]/20 flex items-center justify-center mx-auto mb-5">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9B72CF" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white mb-2">문의가 전달됐습니다!</h3>
                <p className="text-[#888899] text-sm leading-relaxed">
                  빠른 시일 내에 답변 드리겠습니다.<br />
                  보통 24시간 이내로 연락드려요.
                </p>
              </>
            ) : (
              <>
                {/* 실패 아이콘 */}
                <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-5">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white mb-2">전송에 실패했습니다</h3>
                <p className="text-[#888899] text-sm leading-relaxed">
                  잠시 후 다시 시도해주세요.<br />
                  또는 직접 이메일로 연락 주세요.
                </p>
                <a
                  href="mailto:artinsky@boramedia.co.kr"
                  className="inline-block mt-3 text-sm text-[#7B5EA7] hover:text-purple-300 transition-colors"
                >
                  artinsky@boramedia.co.kr
                </a>
              </>
            )}
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 w-full py-2.5 rounded-xl border border-white/10 text-sm text-[#888899] hover:text-white hover:border-white/20 transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
