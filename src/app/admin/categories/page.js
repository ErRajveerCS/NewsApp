"use client";
import { useEffect, useState } from "react";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/categories-list");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName("");
      load();
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) load();
    else {
      const data = await res.json();
      alert(data.error);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Categories</h1>
      <form onSubmit={add} className="flex gap-2 mb-6 max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="border rounded px-3 py-2 text-sm flex-1"
          style={{ borderColor: "var(--hairline)" }}
        />
        <button className="rounded-full px-4 py-2 text-sm text-white" style={{ background: "var(--ink)" }}>
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="border rounded-lg divide-y max-w-md" style={{ borderColor: "var(--hairline)" }}>
        {categories.map((c) => (
          <div key={c.id} className="flex justify-between items-center px-4 py-3">
            <span>{c.name}</span>
            <button onClick={() => remove(c.id)} className="text-sm" style={{ color: "var(--signal)" }}>
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && <p className="p-4 text-sm dateline">No categories yet.</p>}
      </div>
    </div>
  );
}
