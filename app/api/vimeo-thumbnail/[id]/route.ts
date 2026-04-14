import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { invalidateCache } from '@/lib/vimeo';

const TOKEN = process.env.VIMEO_ACCESS_TOKEN;

function isAuthed(): boolean {
  return cookies().get('bm_admin_token')?.value === 'authenticated';
}

/**
 * 썸네일 교체
 * 1) POST /videos/{id}/pictures → upload link 받기
 * 2) PUT upload link로 이미지 업로드
 * 3) PATCH /videos/{id}/pictures/{picture_id} {active: true}
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!TOKEN) return NextResponse.json({ error: 'No Vimeo token' }, { status: 500 });

  const videoId = params.id;

  try {
    const formData = await req.formData();
    const file = formData.get('thumbnail') as File | null;

    if (!file) {
      return NextResponse.json({ error: '이미지 파일이 없습니다.' }, { status: 400 });
    }

    // 1) Vimeo에 picture 리소스 생성 → upload link 받기
    const createRes = await fetch(`https://api.vimeo.com/videos/${videoId}/pictures`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      },
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error('[Vimeo create picture]', createRes.status, err);
      if (createRes.status === 403) {
        return NextResponse.json(
          { error: 'EDIT_SCOPE_REQUIRED', message: 'edit 스코프가 필요합니다.' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `썸네일 리소스 생성 실패: ${createRes.status}` },
        { status: createRes.status }
      );
    }

    const pictureData = await createRes.json();
    const uploadLink: string = pictureData.link;
    const pictureUri: string = pictureData.uri; // /videos/{id}/pictures/{picture_id}

    // 2) upload link에 이미지 PUT
    const arrayBuffer = await file.arrayBuffer();
    const uploadRes = await fetch(uploadLink, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'image/jpeg',
      },
      body: Buffer.from(arrayBuffer),
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error('[Vimeo upload thumbnail]', uploadRes.status, err);
      return NextResponse.json(
        { error: `이미지 업로드 실패: ${uploadRes.status}` },
        { status: uploadRes.status }
      );
    }

    // 3) 활성화 — active: true
    const activateRes = await fetch(`https://api.vimeo.com${pictureUri}`, {
      method: 'PATCH',
      headers: {
        Authorization: `bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
      },
      body: JSON.stringify({ active: true }),
    });

    if (!activateRes.ok) {
      const err = await activateRes.text();
      console.error('[Vimeo activate thumbnail]', activateRes.status, err);
      return NextResponse.json(
        { error: `썸네일 활성화 실패: ${activateRes.status}` },
        { status: activateRes.status }
      );
    }

    invalidateCache();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('[Vimeo thumbnail handler]', e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
