import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { TawkToChat } from "@/components/TawkToChat";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.bridgecarepharma.com"),
  title: {
    default: "Bridgecare Pharmaceuticals Limited",
    template: "%s | Bridgecare Pharmaceuticals",
  },
  description:
    "Improving lives through quality healthcare products, trusted partnerships and responsible health information.",
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
        <Header />
        <main>{children}</main>
        <FloatingContact />
        <Footer />
        <TawkToChat />
      </body>
    </html>
  );
}
