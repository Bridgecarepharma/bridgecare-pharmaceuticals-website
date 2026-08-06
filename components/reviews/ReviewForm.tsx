"use client";

import { FormEvent, useState } from "react";

export function ReviewForm({ productSlug, productName }: { productSlug: string; productName: string }) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const imageUrls = String(form.get("imageUrls") || "")
      .split(/\s+/)
      .map((value) => value.trim())
      .filter(Boolean);
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        productSlug,
        customerName: form.get("customerName"),
        customerEmail: form.get("customerEmail"),
        city: form.get("city"),
        orderNumber: form.get("orderNumber"),
        rating,
        title: form.get("title"),
        body: form.get("body"),
        imageUrls,
      }),
    });
    const result = await response.json();
    setMessage(result.message || result.error || "Review submitted.");
    if (response.ok) event.currentTarget.reset();
    setBusy(false);
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="review-form-heading">
        <div><span className="eyebrow">Share your experience</span><h3>Review {productName}</h3></div>
        <div className="star-picker" aria-label={`Rating: ${rating} out of 5`}>
          {[1,2,3,4,5].map((value) => <button key={value} type="button" aria-label={`${value} star${value === 1 ? "" : "s"}`} onClick={() => setRating(value)} className={value <= rating ? "selected" : ""}>★</button>)}
        </div>
      </div>
      <div className="review-form-grid">
        <label>Name<input name="customerName" required minLength={2} /></label>
        <label>Email<input name="customerEmail" type="email" required /></label>
        <label>City (optional)<input name="city" /></label>
        <label>Order number (for Verified Purchase)<input name="orderNumber" placeholder="e.g. BC-12345" /></label>
      </div>
      <label>Review title (optional)<input name="title" maxLength={120} /></label>
      <label>Your review<textarea name="body" minLength={12} maxLength={2000} rows={5} required placeholder="Tell other customers about the product, packaging, ordering and delivery experience." /></label>
      <label>Optional image URLs (up to 3, separated by spaces)<input name="imageUrls" placeholder="https://..." /></label>
      <p className="review-help">Reviews are moderated before publication. A Verified Purchase badge is added only when the order number and email match an eligible order containing this product.</p>
      <button className="button" disabled={busy} type="submit">{busy ? "Submitting…" : "Submit review"}</button>
      {message && <p className="review-form-message" role="status">{message}</p>}
    </form>
  );
}
