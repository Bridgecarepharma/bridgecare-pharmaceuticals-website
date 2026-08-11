"use client";

import { FormEvent, useState } from "react";

function Stars({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const visualValue = hovered || value;

  return (
    <div className="rating-input-wrap">
      <div className="rating-input" role="radiogroup" aria-label="Choose a star rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            title={`${star} star${star === 1 ? "" : "s"}`}
            className={star <= visualValue ? "active" : ""}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
          >
            ★
          </button>
        ))}
      </div>
      <span className="rating-selected-text" aria-live="polite">
        {value} out of 5 stars selected
      </span>
    </div>
  );
}

export function ReviewForm({ productSlug, productName }: { productSlug: string; productName: string }) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/reviews", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      productSlug, productName, rating,
      customerName: form.get("customerName"), customerEmail: form.get("customerEmail"), city: form.get("city"), orderNumber: form.get("orderNumber"), title: form.get("title"), body: form.get("body")
    })});
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Thank you. Your review has been submitted for approval." : (data.error || "We could not submit your review."));
    if (response.ok) { event.currentTarget.reset(); setRating(5); }
    setBusy(false);
  }
  return <form className="community-form" onSubmit={submit}>
    <div><strong>Rate this product</strong><Stars value={rating} onChange={setRating}/></div>
    <div className="community-form-grid"><label>Name *<input name="customerName" required maxLength={80}/></label><label>Email *<input name="customerEmail" required type="email" maxLength={160}/></label><label>City<input name="city" maxLength={80}/></label><label>Order number <small>(optional, used to verify purchase)</small><input name="orderNumber" maxLength={80}/></label></div>
    <label>Review title<input name="title" maxLength={120}/></label>
    <label>Your review *<textarea name="body" required minLength={10} maxLength={2000} rows={5}/></label>
    <button className="button" disabled={busy}>{busy ? "Submitting…" : "Submit review"}</button>
    {message && <p className="form-status" role="status">{message}</p>}
  </form>;
}

export function QuestionForm({ productSlug, productName }: { productSlug: string; productName: string }) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/questions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productSlug, productName, customerName: form.get("customerName"), customerEmail: form.get("customerEmail"), question: form.get("question") }) });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Thank you. Your question has been sent to Bridgecare for review." : (data.error || "We could not submit your question."));
    if (response.ok) event.currentTarget.reset(); setBusy(false);
  }
  return <form className="community-form" onSubmit={submit}>
    <label>Your question *<textarea name="question" required minLength={8} maxLength={1200} rows={5} placeholder="Ask about product use, dosage, ingredients, storage or other product information."/></label>
    <div className="community-form-grid"><label>Name *<input name="customerName" required maxLength={80}/></label><label>Email *<input name="customerEmail" required type="email" maxLength={160}/></label></div>
    <p className="community-safety-note">For medication interactions, pregnancy, side effects, diagnosis or urgent health concerns, please speak with a pharmacist or healthcare professional.</p>
    <button className="button" disabled={busy}>{busy ? "Sending…" : "Ask a question"}</button>
    {message && <p className="form-status" role="status">{message}</p>}
  </form>;
}
