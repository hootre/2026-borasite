import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getSiteConfig, saveSiteConfig, SiteConfig } from '@/lib/siteConfig';

function isAdmin() {
  return cookies().get('bm_admin_token')?.value === 'authenticated';
}

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ message: '인증 필요' }, { status: 401 });
  return NextResponse.json(getSiteConfig());
}

export async function POST(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ message: '인증 필요' }, { status: 401 });

  try {
    const body = await req.json() as SiteConfig;
    saveSiteConfig(body);
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ message: '저장 실패', error: String(e) }, { status: 500 });
  }
}
