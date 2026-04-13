# BORAMEDIA 홈페이지

Next.js 14 + Tailwind CSS + Vimeo API 기반 영상 프로덕션 홈페이지

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env.local
```
`.env.local` 파일을 열어 Vimeo 토큰 입력:
```
VIMEO_ACCESS_TOKEN=your_token_here
```
> Vimeo 토큰 발급: https://developer.vimeo.com → My Apps → New App → Generate Access Token

### 3. 개발 서버 실행
```bash
npm run dev
# → http://localhost:3000
```

### 4. 빌드 & 배포 (Vercel)
```bash
# Vercel CLI 사용 시
npx vercel deploy

# 또는 GitHub 연결 후 자동 배포
```

---

## 📹 Vimeo 연동 방법

1. [Vimeo](https://vimeo.com) 로그인 → 새 영상 업로드
2. 영상 제목 첫 번째 태그 = 클라이언트명으로 설정
3. 영상 태그에 카테고리 키워드 추가:
   - `뮤직비디오` 또는 `music` → 뮤직비디오
   - `이벤트` 또는 `event` → 이벤트
   - `광고` 또는 `ad` → 광고
   - 기타 → 기업홍보 자동 분류
4. 업로드 후 최대 **1시간** 내 홈페이지에 자동 반영 (캐시 갱신)

> 즉시 반영 원할 시: Vercel 대시보드 → Deployments → Redeploy

---

## 📁 주요 파일 구조

```
app/
├── page.tsx              ← 메인 홈페이지
├── works/
│   ├── page.tsx          ← 전체 작품 목록
│   └── [slug]/page.tsx   ← 개별 작품 페이지
├── about/page.tsx        ← 회사 소개
├── contact/page.tsx      ← 문의 페이지
├── sitemap.ts            ← 자동 생성 사이트맵
└── robots.ts             ← AI 크롤러 허용 설정

lib/
├── vimeo.ts              ← Vimeo API 연동
└── types.ts              ← 타입 정의

components/
├── Navigation.tsx        ← 반응형 네비게이션
├── Hero.tsx              ← 히어로 섹션
├── WorksGrid.tsx         ← 작품 그리드 + 카테고리 필터
├── ClientLogos.tsx       ← 클라이언트 로고 마퀴
├── Stats.tsx             ← 통계 카운터
├── Services.tsx          ← 서비스 특징
├── ContactSection.tsx    ← 문의 CTA
└── Footer.tsx            ← 푸터
```

---

## 🔧 커스터마이징

### 클라이언트 로고 목록 수정
`components/ClientLogos.tsx` → `CLIENTS` 배열 수정

### 통계 수치 수정
`components/Stats.tsx` → `STATS` 배열 수정

### 팀원 정보 수정
`app/about/page.tsx` 수정

### 연락처 수정
`app/contact/page.tsx` + `components/Footer.tsx` 수정

### 히어로 쇼릴 영상 교체
`components/Hero.tsx` → iframe `src` 의 Vimeo 영상 ID 변경

---

## 🌐 Vercel 환경변수 설정

Vercel 대시보드 → Settings → Environment Variables:
- `VIMEO_ACCESS_TOKEN` = 발급받은 토큰
- `VIMEO_USER_ID` = `me` (기본값)

---

## 📧 문의 폼 설정

현재 [FormSubmit](https://formsubmit.co) 무료 서비스 사용.
`app/contact/page.tsx`에서 이메일 주소 확인/변경:
```html
action="https://formsubmit.co/artinsky@boramedia.co.kr"
```
# 2026-borasite
