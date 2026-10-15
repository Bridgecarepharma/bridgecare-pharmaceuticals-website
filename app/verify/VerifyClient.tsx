"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
type Result = { status: string; product?: string; batchNumber?: string; manufacturedAt?: string; expiresAt?: string; firstCheckedAt?: string | null };
const messages: Record<string, [string, string]> = {
 RECOGNISED: ["Code recognised — first check", "Bridgecare issued this code and this is its first recorded check. Compare the details below with your pack."],
 PREVIOUSLY_CHECKED: ["This code has been checked before", "This may be your own earlier check, but copied codes are possible. If this is your first check, contact Bridgecare with photos of the pack and your purchase details."],
 UNRECOGNISED: ["Code not recognised", "Check for typing errors and try again. If the code is correct, contact Bridgecare before using this pack."],
 INACTIVE: ["Code is not active", "This code or its batch has been deactivated or has not yet been released. Contact Bridgecare before using this pack."],
 EXPIRED: ["The recorded batch has expired", "Do not use an expired product. Contact Bridgecare or the pharmacy where you purchased it."],
};
export function VerifyClient() {
 const [code, setCode] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [result, setResult] = useState<Result | null>(null);
 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault(); if(loading)return; setLoading(true); setError(""); setResult(null);
  try { const response = await fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }), cache: "no-store" }); const body = await response.json(); if (!response.ok) throw new Error(body.error || "Unable to check this code."); setResult(body); }
  catch(error) { setError(error instanceof Error ? error.message : "Unable to check this code."); } finally { setLoading(false); }
 }
 const date = (value: string) => new Date(value).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
 return <div className="verification-card"><form onSubmit={submit} className="form"><label htmlFor="security-code">Security code<input id="security-code" value={code} onChange={event=>{setCode(event.target.value);setResult(null);setError("");}} required maxLength={60} autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" aria-describedby="code-help"/></label><p id="code-help">Enter the 24 characters beneath the scratch-off panel. Spaces and hyphens are accepted. Never post your security code publicly.</p><button className="button" disabled={loading}>{loading?"Checking…":"Verify code"}</button></form><div aria-live="polite" aria-atomic="true">{error&&<p className="error-box" role="alert">{error}</p>}{result&&<div className={`verification-result ${result.status==="RECOGNISED"?"recognised":"attention"}`}><h2>{messages[result.status]?.[0]}</h2><p>{messages[result.status]?.[1]}</p>{result.product&&<dl><dt>Product</dt><dd>{result.product}</dd><dt>Batch number</dt><dd>{result.batchNumber}</dd><dt>Manufactured</dt><dd>{date(result.manufacturedAt!)}</dd><dt>Expiry</dt><dd>{date(result.expiresAt!)}</dd>{result.firstCheckedAt&&<><dt>First checked</dt><dd>{new Date(result.firstCheckedAt).toLocaleString("en-NG",{timeZone:"Africa/Lagos"})} (Nigeria time)</dd></>}</dl>}<p>If any details differ from your pack, contact Bridgecare before using it.</p></div>}</div><p className="verification-note">A recognised code helps you check a pack, but cannot guarantee authenticity: genuine codes can be copied. Inspect the seal and compare all pack details.</p><Link className="button secondary" href="/contact">Report a suspicious pack / Contact Bridgecare</Link><p>Phone: <a href="tel:+2348077733373">0807 773 3373</a>. Keep the pack, receipt and batch details for investigation.</p></div>;
}
