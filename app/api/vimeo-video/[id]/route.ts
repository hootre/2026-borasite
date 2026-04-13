import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { invalidateCache } from '@/lib/vimeo';

const TOKEN = process.env.VIMEO_ACCESS_TOKEN;

// 관리자 인증 체크
function isAuthed(): boolean {
  return cookies().get('bm_admin_token')?.value === 'authenticated';
}

// PATCH: 영상 정보 수정 (제목, 설명, 공개 범위, 태그)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!TOKEN) return NextResponse.json({ error: 'No Vimeo token' }, { status: 500 });

  const { name, description, privacy, tags } = await req.json();
  const videoId = params.id;
  const headers = {
    Authorization: `bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
  };

  // 1) 영상 기본 정보 수정 (제목, 설명, 공개범위)
  const body: Record<string, any> = {};
  if (name !== undefined) body.name = name;
  if (description !== undefined) body.description = description;
  if (privacy !== undefined) body.privacy = { view: privacy };

  if (Object.keys(body).length > 0) {
    const res = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Vimeo PATCH]', res.status, err);

      if (res.status === 403) {
        return NextResponse.json(
          { error: 'EDIT_SCOPE_REQUIRED', message: 'edit 스코프가 필요합니다.' },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: `Vimeo 오류: ${res.status}` }, { status: res.status });
    }
  }

  // 2) 태그 업데이트 — Vimeo는 태그를 개별 엔드포인트로 관리
  if (tags !== undefined && Array.isArray(tags)) {
    const tagErrors: string[] = [];

    // 2-a) 기존 태그 조회
    try {
      const existingRes = await fetch(`https://api.vimeo.com/videos/${videoId}/tags`, {
        headers: {
          Authorization: `bearer ${TOKEN}`,
          Accept: 'application/vnd.vimeo.*+json;version=3.4',
        },
      });
      if (existingRes.ok) {
        const existingData = await existingRes.json();
        const existingTags: string[] = (existingData.data || []).map((t: any) => t.canonical || t.name || t.tag);

        // 2-b) 기존 태그 중 새 목록에 없는 것 삭제
        for (const oldTag of existingTags) {
          if (oldTag && !tags.includes(oldTag)) {
            await fetch(`https://api.vimeo.com/videos/${videoId}/tags/${encodeURIComponent(oldTag)}`, {
              method: 'DELETE',
              headers: {
                Authorization: `bearer ${TOKEN}`,
                Accept: 'application/vnd.vimeo.*+json;version=3.4',
              },
            });
          }
        }
      }
    } catch (e) {
      console.error('[Vimeo GET/DELETE tags]', e);
    }

    // 2-c) 새 태그 개별 추가 (PUT /videos/{id}/tags/{word})
    for (const tag of tags) {
      const trimmed = tag.trim();
      if (!trimmed) continue;
      try {
        const tagRes = await fetch(
          `https://api.vimeo.com/videos/${videoId}/tags/${encodeURIComponent(trimmed)}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `bearer ${TOKEN}`,
              'Content-Type': 'application/json',
              Accept: 'application/vnd.vimeo.*+json;version=3.4',
            },
          }
        );
        if (!tagRes.ok) {
          const err = await tagRes.text();
          console.error(`[Vimeo PUT tag "${trimmed}"]`, tagRes.status, err);
          tagErrors.push(trimmed);
        }
      } catch (e: any) {
        console.error(`[Vimeo PUT tag "${trimmed}"]`, e.message);
        tagErrors.push(trimmed);
      }
    }

    if (tagErrors.length > 0) {
      invalidateCache();
      return NextResponse.json({
        success: true,
        tagWarning: `일부 태그 저장 실패: ${tagErrors.join(', ')}. 기본 정보는 저장되었습니다.`,
      });
    }
  }

  invalidateCache();
  return NextResponse.json({ success: true });
}

// DELETE: 영상 삭제
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!TOKEN) return NextResponse.json({ error: 'No Vimeo token' }, { status: 500 });

  const res = await fetch(`https://api.vimeo.com/videos/${params.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
  });

  // 204 = 성공적으로 삭제
  if (res.status === 204 || res.ok) {
    invalidateCache();
    return NextResponse.json({ success: true });
  }

  const err = await res.text();
  console.error('[Vimeo DELETE]', res.status, err);

  if (res.status === 403) {
    return NextResponse.json(
      { error: 'DELETE_SCOPE_REQUIRED', message: 'delete 스코프가 필요합니다.' },
      { status: 403 }
    );
  }

  return NextResponse.json({ error: `Vimeo 오류: ${res.status}` }, { status: res.status });
}
