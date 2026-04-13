export interface VimeoVideo {
  uri: string;
  name: string;
  description: string | null;
  slug: string;
  link: string;
  duration: number;
  width: number;
  height: number;
  created_time: string;
  modified_time: string;
  release_time: string;
  pictures: {
    sizes: Array<{ width: number; height: number; link: string; link_with_play_button: string }>;
    base_link: string;
  };
  tags: Array<{ name: string; canonical: string }>;
  stats: { plays: number | null };
  embed: {
    html: string;
  };
  // Custom fields via Vimeo description parsing
  client?: string;
  category?: WorkCategory;
  year?: number;
}

export type WorkCategory =
  | 'all'
  | 'corporate'
  | 'event'
  | 'music'
  | 'ad'
  | 'drama'
  | 'filming'
  | 'sketch'
  | 'youtube';

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  all:       '전체',
  corporate: '기업홍보',
  event:     '이벤트',
  music:     '뮤직비디오',
  ad:        '광고',
  drama:     '드라마·숏폼',
  filming:   '촬영',
  sketch:    '현장스케치',
  youtube:   '유튜브',
};

export interface WorkMeta {
  id: string;
  title: string;
  client: string;
  year: number;
  category: WorkCategory;
  slug: string;
  thumbnail: string;
  vimeoId: string;
  vimeoEmbedUrl: string;
  description: string;
  tags: string[];
  duration: number;
  width: number;
  height: number;
  releaseTime: string;
}
