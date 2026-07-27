'use client';

import { useEffect, useRef } from 'react';
import { Headphones, MessageCircle, Phone } from 'lucide-react';

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      toggle?: () => void;
      showWidget?: () => void;
      onLoad?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

const TAWK_SCRIPT_ID = 'bridgecare-tawk-widget';
const TAWK_SRC = 'https://embed.tawk.to/627ed97f7b967b11798f4695/1g2vo38lu';

export default function SupportWidgets() {
  const retryTimer = useRef<number | null>(null);

  useEffect(() => {
    // Keep the official Tawk bootstrap isolated in this root-mounted component.
    // The ID guard prevents duplicate widgets during client-side navigation.
    if (document.getElementById(TAWK_SCRIPT_ID)) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.id = TAWK_SCRIPT_ID;
    script.async = true;
    script.src = TAWK_SRC;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    return () => {
      if (retryTimer.current !== null) {
        window.clearTimeout(retryTimer.current);
      }
      // Do not remove the Tawk script on route changes; it should remain global.
    };
  }, []);

  const openLiveChat = () => {
    const open = () => {
      window.Tawk_API?.showWidget?.();

      if (window.Tawk_API?.maximize) {
        window.Tawk_API.maximize();
        return true;
      }

      if (window.Tawk_API?.toggle) {
        window.Tawk_API.toggle();
        return true;
      }

      return false;
    };

    if (open()) return;

    // On slower connections, allow the script a moment to finish loading.
    let attempts = 0;
    const retry = () => {
      attempts += 1;
      if (open() || attempts >= 8) return;
      retryTimer.current = window.setTimeout(retry, 500);
    };
    retryTimer.current = window.setTimeout(retry, 250);
  };

  return (
    <aside className="supportDock" aria-label="Contact Bridgecare">
      <a href="tel:+2348077733373" aria-label="Call Bridgecare">
        <Phone aria-hidden="true" />
        <span>Call</span>
      </a>
      <a
        href="https://wa.link/bridgecarepharmaltd"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Bridgecare on WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
      <button type="button" onClick={openLiveChat} aria-label="Open Bridgecare live chat">
        <Headphones aria-hidden="true" />
        <span>Live chat</span>
      </button>
    </aside>
  );
}
