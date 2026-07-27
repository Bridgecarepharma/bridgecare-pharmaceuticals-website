import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from './components/Cart';
import SupportWidgets from './components/SupportWidgets';
import StructuredData from './components/StructuredData';

const siteUrl = 'https://bridgecarepharma.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bridgecare Pharmaceuticals Limited',
    template: '%s | Bridgecare Pharmaceuticals',
  },
  description: 'Explore Bridgecare pharmaceutical and wellness products, educational health resources and secure online checkout across Nigeria.',
  applicationName: 'Bridgecare Pharmaceuticals',
  authors: [{ name: 'Bridgecare Pharmaceuticals Limited' }],
  creator: 'Bridgecare Pharmaceuticals Limited',
  publisher: 'Bridgecare Pharmaceuticals Limited',
  category: 'Healthcare',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Bridgecare Pharmaceuticals Limited',
    description: 'Quality pharmaceutical and wellness products supported by dependable service across Nigeria.',
    url: siteUrl,
    siteName: 'Bridgecare Pharmaceuticals',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: '/images/hero-integrated.png', width: 1200, height: 630, alt: 'Bridgecare Pharmaceuticals products and healthcare presentation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bridgecare Pharmaceuticals Limited',
    description: 'Quality pharmaceutical and wellness products for healthier lives.',
    images: ['/images/hero-integrated.png'],
  },
  icons: { icon: '/images/logo.webp', apple: '/images/logo.webp' },
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#075f58', colorScheme: 'light' };

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: 'Bridgecare Pharmaceuticals Limited',
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  email: 'smith@bridgecarepharma.com',
  telephone: '+2348077733373',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'LASCOFED Building, 13 Isaacstan Close, Off Wemco Road',
    addressLocality: 'Ogba',
    addressRegion: 'Lagos',
    addressCountry: 'NG',
  },
  contactPoint: [{ '@type': 'ContactPoint', telephone: '+2348077733373', contactType: 'customer service', areaServed: 'NG', availableLanguage: ['English'] }],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'Bridgecare Pharmaceuticals',
  publisher: { '@id': `${siteUrl}/#organization` },
  inLanguage: 'en-NG',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body>
        <StructuredData data={[organizationSchema, websiteSchema]} />
        <CartProvider>{children}<SupportWidgets/></CartProvider>
      </body>
    </html>
  );
}
