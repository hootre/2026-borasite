import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      // AI crawlers - explicitly allow for AI search indexing
      { userAgent: 'GPTBot',         allow: '/' },
      { userAgent: 'ChatGPT-User',   allow: '/' },
      { userAgent: 'PerplexityBot',  allow: '/' },
      { userAgent: 'ClaudeBot',      allow: '/' },
      { userAgent: 'anthropic-ai',   allow: '/' },
      { userAgent: 'CCBot',          allow: '/' },
    ],
    sitemap: 'https://boramedia.co.kr/sitemap.xml',
  };
}
