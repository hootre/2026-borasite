'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '../actions';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, #7B5EA7, #9B6EC7)' }}
    >
      {pending ? (
        <>
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          확인 중...
        </>
      ) : '로그인'}
    </button>
  );
}

export default function LoginClient() {
  const [state, formAction] = useFormState(loginAction, { error: undefined });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #2a1a4a 0%, #0A0A14 65%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#7B5EA7]/20 border border-[#7B5EA7]/30 mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7B5EA7" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">BORAMEDIA</h1>
          <p className="text-[#888899] text-sm mt-1">관리자 로그인</p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs text-[#888899] mb-2">비밀번호</label>
            <input
              name="password"
              type="password"
              placeholder="관리자 비밀번호 입력"
              required
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-[#555566] outline-none transition-all
                ${state.error ? 'border-red-500/60' : 'border-white/10 focus:border-[#7B5EA7]/60'}`}
              autoFocus
            />
            {state.error && (
              <p className="text-red-400 text-xs mt-2">{state.error}</p>
            )}
          </div>
          <SubmitButton />
        </form>

        <p className="text-center text-xs text-[#444455] mt-8">
          <Link href="/" className="hover:text-[#7B5EA7] transition-colors">← 사이트로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
