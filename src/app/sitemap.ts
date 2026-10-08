import type { MetadataRoute } from 'next';
import { pages, SITE_URL } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    ...Object.values(pages).map((p) => ({ url: `${SITE_URL}${p.href}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ];
}
