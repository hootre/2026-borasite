import { WorkMeta, WorkCategory } from './types';

const VIMEO_API = 'https://api.vimeo.com';
const TOKEN = process.env.VIMEO_ACCESS_TOKEN;
const USER_ID = process.env.VIMEO_USER_ID ?? 'me';

// ─── 인메모리 캐시 (같은 요청 주기 내 중복 API 호출 방지) ──────────────────

let cachedWorks: WorkMeta[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 60초 인메모리 캐시

function invalidateCache() {
  cachedWorks = null;
  cacheTimestamp = 0;
}

// ─── Vimeo API Fetch ────────────────────────────────────────────────────────

async function vimeoFetch(path: string, params?: Record<string, string>) {
  if (!TOKEN) {
    console.warn('[Vimeo] VIMEO_ACCESS_TOKEN이 없습니다. 샘플 데이터 사용.');
    return null;
  }
  const url = new URL(`${VIMEO_API}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    const errBody = await res.text();
    console.error(`[Vimeo] API 오류: ${res.status} | ${errBody}`);
    return null;
  }
  return res.json();
}

// ─── 카테고리 감지 (태그 우선 → 제목 폴백) ──────────────────────────────

const TAG_TO_CATEGORY: Record<string, WorkCategory> = {
  '기업홍보': 'corporate',
  'corporate': 'corporate',
  '광고홍보': 'corporate',
  '광고/홍보': 'corporate',
  '광고': 'corporate',
  'ad': 'corporate',
  '이벤트': 'event',
  'event': 'event',
  '뮤직비디오': 'music',
  'music': 'music',
  'mv': 'music',
  '드라마': 'drama',
  'drama': 'drama',
  '숏폼': 'drama',
  '촬영': 'filming',
  'filming': 'filming',
  '현장스케치': 'sketch',
  '현장 스케치': 'sketch',
  'sketch': 'sketch',
  '유튜브': 'youtube',
  'youtube': 'youtube',
};

function detectCategory(title: string, tags: string[]): WorkCategory {
  for (const tag of tags) {
    const cat = TAG_TO_CATEGORY[tag.toLowerCase()];
    if (cat) return cat;
  }
  const t = (title + ' ' + tags.join(' ')).toLowerCase();
  if (/뮤직|music|mv|music.video/.test(t)) return 'music';
  if (/드라마|drama|숏폼|shortform|short.form/.test(t)) return 'drama';
  if (/광고|홍보|ad|commercial|tvc/.test(t)) return 'corporate';
  if (/현장스케치|현장.스케치|sketch/.test(t)) return 'sketch';
  if (/행사|박람회|페스티벌|이벤트|event|festival/.test(t)) return 'event';
  return 'corporate';
}

// ─── embed HTML에서 src URL 추출 (해시 포함) ────────────────────────────────

function extractEmbedUrl(embedHtml?: string): string | null {
  if (!embedHtml) return null;
  const match = embedHtml.match(/src="([^"]+)"/);
  return match ? match[1] : null;
}

// ─── Vimeo video → WorkMeta 변환 ────────────────────────────────────────────

function videoToWork(video: any): WorkMeta {
  const vimeoId = video.uri.replace('/videos/', '');
  const thumbnail =
    video.pictures?.sizes?.find((s: any) => s.width >= 640)?.link ||
    video.pictures?.base_link ||
    '/placeholder.jpg';

  const year = new Date(video.release_time ?? video.created_time).getFullYear();
  const tags = (video.tags ?? []).map((t: any) => t.name);

  const bracketMatch = video.name.match(/\[(.+?)\]/);
  const client = bracketMatch ? bracketMatch[1] : (tags[0] ?? video.name.split(' ')[0]);

  return {
    id: vimeoId,
    title: video.name,
    client,
    year,
    category: detectCategory(video.name, tags),
    slug: vimeoId,
    thumbnail,
    vimeoId,
    vimeoEmbedUrl: extractEmbedUrl(video.embed?.html) ?? `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`,
    description: video.description ?? '',
    tags,
    duration: video.duration ?? 0,
    width: video.width ?? 0,
    height: video.height ?? 0,
    releaseTime: video.release_time ?? video.created_time ?? '',
  };
}

/** 태그 배열에서 6자리 날짜(YYMMDD)를 찾아 숫자로 반환. 없으면 0 */
function getTagDate(tags: string[]): number {
  for (const tag of tags) {
    const match = tag.match(/^(\d{6})$/);
    if (match) return parseInt(match[1], 10);
  }
  return 0;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getAllWorks(): Promise<WorkMeta[]> {
  // 인메모리 캐시 히트 — 같은 요청 주기 내 중복 호출 방지
  const now = Date.now();
  if (cachedWorks && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedWorks;
  }

  const data = await vimeoFetch(`/users/${USER_ID}/videos`, {
    per_page: '100',
    sort: 'date',
    direction: 'desc',
    fields: 'uri,name,description,link,duration,width,height,created_time,release_time,modified_time,pictures,tags,stats,embed',
  });

  if (!data) return SAMPLE_WORKS;

  const works = (data.data ?? []).map(videoToWork);

  works.sort((a: WorkMeta, b: WorkMeta) => {
    const dateA = getTagDate(a.tags);
    const dateB = getTagDate(b.tags);
    return dateB - dateA;
  });

  // 캐시 저장
  cachedWorks = works;
  cacheTimestamp = now;

  return works;
}

export async function getShowreel(): Promise<{ vimeoId: string; embedUrl: string } | null> {
  const all = await getAllWorks();
  const found = all.find((w) => w.tags.some((t) => t === '메인영상'));
  return found ? { vimeoId: found.vimeoId, embedUrl: found.vimeoEmbedUrl } : null;
}

export async function getWorkBySlug(slug: string): Promise<WorkMeta | null> {
  // 캐시된 전체 목록에서 먼저 찾기 (추가 API 호출 없음)
  const all = await getAllWorks();
  return all.find((w) => w.slug === slug || w.vimeoId === slug || w.id === slug) ?? null;
}

/** revalidate API에서 캐시 강제 초기화용 */
export { invalidateCache };

// ─── Sample data (API 키 없을 때 사용) ──────────────────────────────────────

export const SAMPLE_WORKS: WorkMeta[] = [
  { id: '1', title: '교촌에프엔비 바르고봉사단', client: '교촌에프엔비', year: 2025, category: 'corporate', slug: '2025-kyochon-volunteer', thumbnail: 'https://i.vimeocdn.com/video/default_1280.jpg', vimeoId: '1', vimeoEmbedUrl: '', description: '', tags: ['교촌에프엔비', '기업홍보'], duration: 180, width: 1920, height: 1080, releaseTime: '2025-01-01T00:00:00+00:00' },
  { id: '2', title: '한화시스템 신의기술 1,2화', client: '한화시스템', year: 2025, category: 'corporate', slug: '2025-hanwha-systems', thumbnail: 'https://i.vimeocdn.com/video/default_1280.jpg', vimeoId: '2', vimeoEmbedUrl: '', description: '', tags: ['한화시스템', '기업홍보'], duration: 240, width: 1920, height: 1080, releaseTime: '2025-01-15T00:00:00+00:00' },
  { id: '3', title: '메쎄이상 코리아베이비페어', client: '메쎄이상', year: 2025, category: 'event', slug: '2025-messeesang-korababyfair', thumbnail: 'https://i.vimeocdn.com/video/default_1280.jpg', vimeoId: '3', vimeoEmbedUrl: '', description: '', tags: ['메쎄이상', '이벤트'], duration: 300, width: 1920, height: 1080, releaseTime: '2025-02-01T00:00:00+00:00' },
  { id: '4', title: 'Korea Tourism Organization: Kantabi Supporters', client: '한국관광공사', year: 2024, category: 'ad', slug: '2024-kto-kantabi', thumbnail: 'https://i.vimeocdn.com/video/default_1280.jpg', vimeoId: '4', vimeoEmbedUrl: '', description: '', tags: ['한국관광공사', '광고'], duration: 120, width: 1920, height: 1080, releaseTime: '2024-06-01T00:00:00+00:00' },
  { id: '5', title: 'Puma Korea Annual Closing Ceremony', client: 'Puma Korea', year: 2024, category: 'event', slug: '2024-puma-korea-ceremony', thumbnail: 'https://i.vimeocdn.com/video/default_1280.jpg', vimeoId: '5', vimeoEmbedUrl: '', description: '', tags: ['PUMA', '이벤트'], duration: 360, width: 1920, height: 1080, releaseTime: '2024-05-01T00:00:00+00:00' },
  { id: '6', title: 'Astro Moonbin & Sanha MV', client: 'Fantagio', year: 2024, category: 'music', slug: '2024-astro-moonbin-sanha', thumbnail: 'https://i.vimeocdn.com/video/default_1280.jpg', vimeoId: '6', vimeoEmbedUrl: '', description: '', tags: ['Fantagio', '뮤직비디오'], duration: 210, width: 1920, height: 1080, releaseTime: '2024-04-01T00:00:00+00:00' },
  { id: '7', title: '쿠팡 광주FC 기공식', client: '쿠팡', year: 2025, category: 'event', slug: '2025-coupang-gwangju-groundbreaking', thumbnail: 'https://i.vimeocdn.com/video/default_1280.jpg', vimeoId: '7', vimeoEmbedUrl: '', description: '', tags: ['쿠팡', '이벤트'], duration: 420, width: 3840, height: 2160, releaseTime: '2025-03-01T00:00:00+00:00' },
  { id: '8', title: 'Amway Nutrilite', client: 'Amway', year: 2024, category: 'ad', slug: '2024-amway-nutrilite', thumbnail: 'https://i.vimeocdn.com/video/default_1280.jpg', vimeoId: '8', vimeoEmbedUrl: '', description: '', tags: ['Amway', '광고'], duration: 90, width: 1920, height: 1080, releaseTime: '2024-07-01T00:00:00+00:00' },
];
