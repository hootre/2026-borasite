import { NextRequest, NextResponse } from 'next/server';

const TOKEN = process.env.VIMEO_ACCESS_TOKEN;

// POST: Vimeo에 업로드 티켓 생성 (tus 방식)
export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({ error: 'VIMEO_ACCESS_TOKEN이 설정되지 않았습니다.' }, { status: 500 });
  }

  const { name, description, size, privacy, tags } = await req.json();

  if (!size || size <= 0) {
    return NextResponse.json({ error: '파일 크기가 올바르지 않습니다.' }, { status: 400 });
  }

  const body = {
    upload: {
      approach: 'tus',
      size: size,
    },
    name: name || '새 영상',
    description: description || '',
    privacy: {
      view: privacy || 'disable', // 기본값: 비공개 (disable = 링크 있는 사람만)
      embed: 'whitelist',
      comments: 'nobody',
    },
  };

  const res = await fetch('https://api.vimeo.com/me/videos', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Vimeo Upload] 티켓 생성 실패:', res.status, err);

    // 403: upload 스코프 없음
    if (res.status === 403) {
      return NextResponse.json(
        { error: 'UPLOAD_SCOPE_REQUIRED', message: '현재 액세스 토큰에 upload 권한이 없습니다. Vimeo 개발자 페이지에서 upload 스코프가 포함된 새 토큰을 생성하세요.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: `Vimeo API 오류: ${res.status}` }, { status: res.status });
  }

  const data = await res.json();
  const videoUri = data.uri; // e.g. /videos/123456789

  // 태그가 있으면 영상에 태그 추가 (비메오는 영상 생성 후 별도 PUT)
  if (tags && Array.isArray(tags) && tags.length > 0 && videoUri) {
    try {
      await fetch(`https://api.vimeo.com${videoUri}/tags`, {
        method: 'PUT',
        headers: {
          Authorization: `bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tags.map((t: string) => ({ tag: t }))),
      });
    } catch (e) {
      console.warn('[Vimeo Upload] 태그 추가 실패:', e);
    }
  }

  return NextResponse.json({
    uploadUrl: data.upload?.upload_link,
    videoUri,
    videoId: videoUri?.replace('/videos/', ''),
    vimeoLink: data.link,         // https://vimeo.com/123456789
  });
}
