import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${baseUrl}/sitemap.xml`,
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/updateProjects',
    },
  };
}
