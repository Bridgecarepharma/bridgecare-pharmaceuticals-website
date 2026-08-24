export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bridgecare Pharmaceuticals Limited',
    short_name: 'Bridgecare',
    description: 'Quality pharmaceutical and wellness products for healthier lives across Nigeria.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#075f58',
    icons: [
      { src: '/images/logo.webp', sizes: 'any', type: 'image/webp' },
      { src: '/images/logo.png', sizes: 'any', type: 'image/png' },
    ],
  };
}
