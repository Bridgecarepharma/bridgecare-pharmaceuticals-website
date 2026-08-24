import type { MetadataRoute } from 'next';
import { products } from '../lib/products';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bridgecarepharma.com';
  const now = new Date();
  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/health-finder', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'yearly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' as const },
    { path: '/distributor', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/resources', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  return [
    ...staticRoutes.map(({ path, ...entry }) => ({ url: `${baseUrl}${path}/`, lastModified: now, ...entry })),
    ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ];
}
