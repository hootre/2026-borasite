import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { invalidateCache } from '@/lib/vimeo';

export async function POST(_req: NextRequest) {
  // 관리자 쿠키 확인
  const token = cookies().get('bm_admin_token')?.value;
  if (token !== 'authenticated') {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 });
  }

  invalidateCache();
  revalidatePath('/', 'layout');

  return NextResponse.json({
    ok: true,
    message: '캐시가 초기화되었습니다.',
    timestamp: new Date().toISOString(),
  });
}
