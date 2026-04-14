import fs from 'fs';
export type { SiteConfig } from './siteConfigTypes';
export { DEFAULT_CONFIG } from './siteConfigTypes';
import type { SiteConfig } from './siteConfigTypes';
import { DEFAULT_CONFIG } from './siteConfigTypes';

const CONFIG_PATH = '/tmp/boramedia-siteconfig.json';

let memCache: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (memCache) return memCache;
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    memCache = { ...DEFAULT_CONFIG, ...JSON.parse(raw) } as SiteConfig;
  } catch {
    memCache = { ...DEFAULT_CONFIG };
  }
  return memCache as SiteConfig;
}

export function saveSiteConfig(config: SiteConfig): void {
  memCache = { ...config };
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[SiteConfig] 파일 저장 실패, 메모리 캐시만 사용:', e);
  }
}

export function invalidateSiteConfigCache(): void {
  memCache = null;
}
