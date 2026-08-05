"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
    if (res.ok) setEmail("");
  }

  if (status === "done") {
    return <p className="dateline" style={{ color: "var(--wire)" }}>Subscribed — thanks for joining.</p>;
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        required
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-full px-4 py-2 text-sm"
        style={{ borderColor: "var(--hairline)" }}
      />
      <button className="rounded-full px-4 py-2 text-sm text-white whitespace-nowrap" style={{ background: "var(--ink)" }}>
        {status === "sending" ? "…" : "Subscribe"}
      </button>
      {status === "error" && <span className="text-xs text-red-600">Try again</span>}
    </form>
  );
}
