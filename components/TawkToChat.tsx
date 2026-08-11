"use client";

import Script from "next/script";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
  }
}

export function TawkToChat() {
  return (
    <Script id="tawk-to-chat" strategy="afterInteractive">
      {`
        window.Tawk_API = window.Tawk_API || {};
        // On phones Bridgecare already provides a single floating WhatsApp action.
        // Hide the separate Tawk bubble there to avoid overlapping contact buttons.
        var bridgecareMobile = window.matchMedia("(max-width: 600px)");
        window.Tawk_API.onLoad = function () {
          if (bridgecareMobile.matches && window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
            window.Tawk_API.hideWidget();
          }
        };
        window.Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement("script");
          var s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = "https://embed.tawk.to/627ed97f7b967b11798f4695/1g2vo38lu";
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          if (s0 && s0.parentNode) s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
