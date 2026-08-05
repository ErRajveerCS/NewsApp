"use client";
import { useState } from "react";

export default function CommentForm({ articleId }) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, name, body }),
    });
    if (res.ok) {
      setStatus("sent");
      setName("");
      setBody("");
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm" style={{ color: "var(--wire)" }}>
        Thanks — your comment was submitted and will appear once approved.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 max-w-lg">
      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
        style={{ borderColor: "var(--hairline)" }}
      />
      <textarea
        required
        placeholder="Add a comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="border rounded px-3 py-2 text-sm"
        style={{ borderColor: "var(--hairline)" }}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded-full px-4 py-2 text-sm text-white"
        style={{ background: "var(--ink)" }}
      >
        {status === "sending" ? "Posting…" : "Post comment"}
      </button>
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Try again.</p>}
    </form>
  );
}
