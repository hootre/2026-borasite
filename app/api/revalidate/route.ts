import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { invalidateCache } from '@/lib/vimeo';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: '유효하지 않은 토큰입니다.' }, { status: 401 });
  }

  try {
    // Vimeo 인메모리 캐시 초기화
    invalidateCache();

    // Next.js 페이지 캐시 무효화
    revalidatePath('/', 'layout');

    return NextResponse.json({
      revalidated: true,
      message: '인메모리 캐시 + 페이지 캐시가 갱신되었습니다.',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: '캐시 갱신 중 오류가 발생했습니다.', error: String(err) },
      { status: 500 }
    );
  }
}
