export interface SiteConfig {
  // 히어로
  heroBadge:    string;
  heroLine1:    string;
  heroLine2:    string;
  heroLine3:    string;
  heroSubtitle: string;
  // 통계
  statClients:  string;
  statVideos:   string;
  statTeam:     string;
  // 카테고리 표시명
  catAll:       string;
  catCorporate: string;
  catMusic:     string;
  catFilming:   string;
  catSketch:    string;
  catYoutube:   string;
}

export const DEFAULT_CONFIG: SiteConfig = {
  heroBadge:    '영상 프로덕션 전문 기업',
  heroLine1:    '생동감 넘치게',
  heroLine2:    '당신의 이야기를',
  heroLine3:    '기록해드립니다.',
  heroSubtitle: '영상이라는 매체로 당신의 순간을 생생하게 기록합니다.\n기업홍보 · 공연 · 뮤직비디오 · 이벤트 · 광고 영상 전문 제작.',
  statClients:  '137+',
  statVideos:   '385+',
  statTeam:     '5+',
  catAll:       '전체',
  catCorporate: '광고/홍보',
  catMusic:     '뮤직비디오',
  catFilming:   '촬영',
  catSketch:    '현장스케치',
  catYoutube:   '유튜브',
};
