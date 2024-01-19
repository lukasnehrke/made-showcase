import type { MetadataRoute } from 'next';
import { baseUrl, semesters } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return semesters.map((semester) => ({
    url: `${baseUrl}/${semester}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));
}
