"use client";

export function PrintButton({ label = "Print" }: { label?: string }) {
  return <button className="button admin-print-button" type="button" onClick={() => window.print()}>{label}</button>;
}
