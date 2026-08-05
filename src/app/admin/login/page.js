"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-display text-2xl font-semibold mb-1">The Daily Wire Desk</h1>
      <p className="dateline mb-6">Admin sign in</p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border rounded px-3 py-2 text-sm"
          style={{ borderColor: "var(--hairline)" }}
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border rounded px-3 py-2 text-sm"
          style={{ borderColor: "var(--hairline)" }}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded-full px-4 py-2 text-sm text-white" style={{ background: "var(--ink)" }}>
          Sign in
        </button>
      </form>
    </main>
  );
}
