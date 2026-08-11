import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingContact } from "@/components/FloatingContact";
import { TawkToChat } from "@/components/TawkToChat";
import { MarketingAnalytics } from "@/components/analytics/MarketingAnalytics";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.bridgecarepharma.com"
  ),

  title: {
    default: "Bridgecare Pharmaceuticals Limited",
    template: "%s | Bridgecare Pharmaceuticals",
  },

  description:
    "Improving lives through quality healthcare products, trusted partnerships and responsible health information.",

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    siteName: "Bridgecare Pharmaceuticals Limited",
    title: "Bridgecare Pharmaceuticals Limited",
    description:
      "Quality healthcare and wellness products, responsible health information and secure online ordering in Nigeria.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Bridgecare Pharmaceuticals Limited",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bridgecare Pharmaceuticals Limited",
    description: "Quality healthcare and wellness products in Nigeria.",
    images: ["/icon.png"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />

          {children}

          <CartDrawer />\n          <Footer />
          <FloatingContact />
          <TawkToChat />
          <MarketingAnalytics />
          <StructuredData />
        </CartProvider>

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];

              ttq.methods=[
                "page",
                "track",
                "identify",
                "instances",
                "debug",
                "on",
                "off",
                "once",
                "ready",
                "alias",
                "group",
                "enableCookie",
                "disableCookie",
                "holdConsent",
                "revokeConsent",
                "grantConsent"
              ];

              ttq.setAndDefer=function(t,e){
                t[e]=function(){
                  t.push([e].concat(
                    Array.prototype.slice.call(arguments,0)
                  ))
                }
              };

              for(var i=0;i<ttq.methods.length;i++){
                ttq.setAndDefer(ttq,ttq.methods[i]);
              }

              ttq.instance=function(t){
                for(
                  var e=ttq._i[t]||[],n=0;
                  n<ttq.methods.length;
                  n++
                ){
                  ttq.setAndDefer(e,ttq.methods[n]);
                }
                return e
              };

              ttq.load=function(e,n){
                var r="https://analytics.tiktok.com/i18n/pixel/events.js",
                    o=n&&n.partner;

                ttq._i=ttq._i||{};
                ttq._i[e]=[];
                ttq._i[e]._u=r;

                ttq._t=ttq._t||{};
                ttq._t[e]=+new Date;

                ttq._o=ttq._o||{};
                ttq._o[e]=n||{};

                n=document.createElement("script");
                n.type="text/javascript";
                n.async=!0;
                n.src=r+"?sdkid="+e+"&lib="+t;

                e=document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n,e);
              };

              ttq.load('D9S8F1JC77U6RO6J5240');
              ttq.page();

            }(window, document, 'ttq');
          `}
        </Script>
      </body>
    </html>
  );
}
