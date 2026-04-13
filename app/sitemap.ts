import { MetadataRoute } from 'next';
import { getAllWorks } from '@/lib/vimeo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://boramedia.co.kr';
  const works = await getAllWorks();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/works`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/about`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  const workRoutes: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${baseUrl}/works/${work.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes];
}
