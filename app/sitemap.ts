import type { MetadataRoute } from 'next'
import { istanbulDistricts } from '@/lib/data/istanbul'

const BASE_URL = 'https://www.netfiyatal.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...istanbulDistricts.map((district) => ({
      url: `${BASE_URL}/istanbul/${district.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
