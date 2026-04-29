// 서버 전용 — fs 사용
import fs from 'fs';
import path from 'path';
import { WorkLinks } from './workLinksTypes';

const FILE = '/tmp/boramedia-worklinks.json';

let cache: WorkLinks | null = null;

export function getWorkLinks(): WorkLinks {
  if (cache) return cache;
  try {
    if (fs.existsSync(FILE)) {
      cache = JSON.parse(fs.readFileSync(FILE, 'utf-8')) as WorkLinks;
      return cache;
    }
  } catch {
    // 파일 없거나 파싱 실패 → 빈 객체
  }
  return {};
}

export function saveWorkLinks(data: WorkLinks): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
  cache = data;
}

export function getWorkLink(vimeoId: string): { url: string; text: string } {
  const links = getWorkLinks();
  return {
    url:  links[vimeoId]?.url  || `https://vimeo.com/${vimeoId}`,
    text: links[vimeoId]?.text || 'Vimeo에서 보기',
  };
}
