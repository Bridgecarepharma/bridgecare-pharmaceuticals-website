import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <FloatingContact />
          <Footer />
        </CartProvider>
        <TawkToChat />
      </body>
    </html>
  );
}
