import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://boramedia.co.kr'),
  title: {
    default: 'BORAMEDIA | 영상 프로덕션 전문 기업',
    template: '%s | BORAMEDIA',
  },
  description:
    '보라미디어는 기업홍보, 뮤직비디오, 이벤트, 광고 영상을 전문으로 제작합니다. 삼성, 한국관광공사, 쿠팡, 한화시스템 등 137개 고객사와 함께한 영상 프로덕션 전문 기업입니다.',
  keywords: ['영상제작', '영상프로덕션', '기업홍보영상', '뮤직비디오제작', '광고영상', '이벤트영상', 'boramedia', '보라미디어'],
  authors: [{ name: 'BORAMEDIA', url: 'https://boramedia.co.kr' }],
  creator: 'BORAMEDIA',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://boramedia.co.kr',
    siteName: 'BORAMEDIA',
    title: 'BORAMEDIA | 영상 프로덕션 전문 기업',
    description: '보라미디어는 기업홍보, 뮤직비디오, 이벤트, 광고 영상을 전문으로 제작합니다.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'BORAMEDIA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BORAMEDIA | 영상 프로덕션 전문 기업',
    description: '보라미디어는 기업홍보, 뮤직비디오, 이벤트, 광고 영상을 전문으로 제작합니다.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: 'https://boramedia.co.kr' },
};

// Organization JSON-LD
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BORAMEDIA',
  alternateName: '보라미디어',
  url: 'https://boramedia.co.kr',
  logo: 'https://boramedia.co.kr/logo.png',
  email: 'artinsky@boramedia.co.kr',
  description: '기업홍보, 뮤직비디오, 이벤트, 광고 영상 전문 프로덕션',
  areaServed: 'KR',
  serviceType: ['영상 제작', '기업홍보 영상', '뮤직비디오', '이벤트 영상', '광고 영상'],
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
  sameAs: ['https://vimeo.com/boramedia'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="dns-prefetch" href="https://i.vimeocdn.com" />
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
