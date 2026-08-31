"use client";

import Script from "next/script";

export function TawkToChat() {
  return (
    <Script id="tawk-to-chat" strategy="afterInteractive">
      {`
        window.Tawk_API = window.Tawk_API || {};
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
