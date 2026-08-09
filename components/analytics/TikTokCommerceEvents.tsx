"use client";

import { useEffect } from "react";

type TikTokQueue = {
  track?: (event: string, payload?: Record<string, unknown>) => void;
};

function getTtq(): TikTokQueue | undefined {
  return (window as Window & { ttq?: TikTokQueue }).ttq;
}

function whenTtqReady(send: (ttq: TikTokQueue) => void) {
  let attempts = 0;
  const trySend = () => {
    const ttq = getTtq();
    if (ttq && typeof ttq.track === "function") {
      send(ttq);
      return true;
    }
    return false;
  };

  if (trySend()) return () => {};

  const timer = window.setInterval(() => {
    attempts += 1;
    if (trySend() || attempts >= 40) window.clearInterval(timer);
  }, 250);

  return () => window.clearInterval(timer);
}

function money(priceKobo: number) {
  return Number((priceKobo / 100).toFixed(2));
}

export function TikTokProductView({
  slug,
  name,
  priceKobo,
}: {
  slug: string;
  name: string;
  priceKobo: number;
}) {
  useEffect(
    () =>
      whenTtqReady((ttq) =>
        ttq.track?.("ViewContent", {
          content_type: "product",
          content_ids: [slug],
          description: name,
          quantity: 1,
          value: money(priceKobo),
          currency: "NGN",
        })
      ),
    [slug, name, priceKobo]
  );
  return null;
}

export function TikTokInitiateCheckout({
  items,
  subtotalKobo,
}: {
  items: { slug: string; name: string; priceKobo: number; quantity: number }[];
  subtotalKobo: number;
}) {
  const signature = items
    .map((item) => `${item.slug}:${item.quantity}:${item.priceKobo}`)
    .join("|");

  useEffect(() => {
    if (!items.length) return;
    return whenTtqReady((ttq) =>
      ttq.track?.("InitiateCheckout", {
        content_type: "product",
        content_ids: items.map((item) => item.slug),
        description: items.map((item) => item.name).join(", "),
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        value: money(subtotalKobo),
        currency: "NGN",
      })
    );
  // items are represented by signature so quantity/price changes still retrigger the event.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, subtotalKobo]);

  return null;
}

export function trackTikTokAddToCart({
  slug,
  name,
  priceKobo,
  quantity = 1,
}: {
  slug: string;
  name: string;
  priceKobo: number;
  quantity?: number;
}) {
  const send = (ttq: TikTokQueue) =>
    ttq.track?.("AddToCart", {
      content_type: "product",
      content_ids: [slug],
      description: name,
      quantity,
      value: money(priceKobo * quantity),
      currency: "NGN",
    });

  const ttq = getTtq();
  if (ttq && typeof ttq.track === "function") send(ttq);
  else whenTtqReady(send);
}

export function trackTikTokPurchase({
  reference,
  orderNumber,
  totalKobo,
  items,
}: {
  reference: string;
  orderNumber: string;
  totalKobo: number;
  items: { slug: string; name: string; quantity: number }[];
}) {
  const storageKey = `bridgecare-tiktok-purchase:${reference}`;
  try {
    if (window.localStorage.getItem(storageKey) === "sent") return () => {};
  } catch {}

  const send = (ttq: TikTokQueue) => {
    ttq.track?.("Purchase", {
      content_type: "product",
      content_ids: items.map((item) => item.slug),
      description: `Order ${orderNumber}: ${items.map((item) => item.name).join(", ")}`,
      quantity: items.reduce((sum, item) => sum + item.quantity, 0),
      value: money(totalKobo),
      currency: "NGN",
    });
    try {
      window.localStorage.setItem(storageKey, "sent");
    } catch {}
  };

  const ttq = getTtq();
  if (ttq && typeof ttq.track === "function") {
    send(ttq);
    return () => {};
  }

  return whenTtqReady(send);
}
