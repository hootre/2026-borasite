import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getWorkLinks, saveWorkLinks } from '@/lib/workLinks';
import { WorkLinks } from '@/lib/workLinksTypes';

function isAdmin() {
  const token = cookies().get('bm_admin_token')?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getWorkLinks());
}

export async function POST(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = (await req.json()) as WorkLinks;
    saveWorkLinks(data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
