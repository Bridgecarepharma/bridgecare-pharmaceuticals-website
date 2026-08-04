import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { FloatingContact } from "@/components/FloatingContact";
import { TawkToChat } from "@/components/TawkToChat";
import { MarketingAnalytics } from "@/components/analytics/MarketingAnalytics";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.bridgecarepharma.com"),
  title: {
    default: "Bridgecare Pharmaceuticals Limited",
    template: "%s | Bridgecare Pharmaceuticals",
  },
  description:
    "Improving lives through quality healthcare products, trusted partnerships and responsible health information.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Bridgecare Pharmaceuticals Limited",
    title: "Bridgecare Pharmaceuticals Limited",
    description: "Quality healthcare and wellness products, responsible health information and secure online ordering in Nigeria.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "Bridgecare Pharmaceuticals Limited" }],
  },
  twitter: { card: "summary_large_image", title: "Bridgecare Pharmaceuticals Limited", description: "Quality healthcare and wellness products in Nigeria.", images: ["/icon.png"] },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <FloatingContact />
          <Footer />
        </CartProvider>
        <TawkToChat />
        <MarketingAnalytics />
      </body>
    </html>
  );
}
