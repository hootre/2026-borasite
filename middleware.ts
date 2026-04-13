import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('bm_admin_token')?.value;
  const authed = token === 'authenticated';

  // 로그인 페이지: 이미 인증됐으면 대시보드로
  if (pathname === '/admin/login') {
    if (authed) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.next();
  }

  // /admin/* 모든 경로: 미인증이면 로그인으로
  if (!authed) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
