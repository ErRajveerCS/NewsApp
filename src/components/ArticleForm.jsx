"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass = "border rounded px-3 py-2 text-sm w-full";
const inputStyle = { borderColor: "var(--hairline)" };

export default function ArticleForm({ article, categories, authors }) {
  const router = useRouter();
  const isNew = !article;
  const [form, setForm] = useState({
    title: article?.title || "",
    summary: article?.summary || "",
    content: article?.content || "",
    cover_image: article?.cover_image || "",
    youtube_url: article?.youtube_url || "",
    category_id: article?.category_id || (categories[0]?.id ?? ""),
    byline_label: article?.byline_label || "Reported by",
    byline_name: article?.byline_name || "",
    status: article?.status || "draft",
    featured: !!article?.featured,
    breaking: !!article?.breaking,
    tags: article?.tags || "",
    source_name: article?.source_name || "",
    source_url: article?.source_url || "",
    source_credit: article?.source_credit || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadImage(file) {
    setUploadError("");

    if (file.size > 2 * 1024 * 1024) {
      setUploadError(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB — please use one under 2MB (resize or compress it first).`
      );
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server didn't return a valid response. The image may be too large or an unsupported format.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      if (data.url) set("cover_image", data.url);
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${article.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save");
    }
  }

  async function remove() {
    if (!confirm("Delete this article permanently?")) return;
    await fetch(`/api/admin/articles/${article.id}`, { method: "DELETE" });
    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 max-w-3xl">
      <div>
        <label className="dateline block mb-1">Title</label>
        <input required className={inputClass} style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div>
        <label className="dateline block mb-1">Summary / dek</label>
        <textarea rows={2} className={inputClass} style={inputStyle} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
      </div>

      <div>
        <label className="dateline block mb-1">Content (Markdown supported)</label>
        <textarea required rows={14} className={`${inputClass} font-mono`} style={inputStyle} value={form.content} onChange={(e) => set("content", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="dateline block mb-1">Category</label>
          <select className={inputClass} style={inputStyle} value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div />
      </div>

      <fieldset className="border rounded-lg p-4" style={inputStyle}>
        <legend className="dateline px-1">Byline</legend>
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          Choose how this piece is credited — useful for flagging opinion, analysis, or
          investigative pieces differently from straight reporting.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="dateline block mb-1">Byline label</label>
            <select className={inputClass} style={inputStyle} value={form.byline_label} onChange={(e) => set("byline_label", e.target.value)}>
              <option value="Reported by">Reported by</option>
              <option value="Written by">Written by</option>
              <option value="Analysis by">Analysis by</option>
              <option value="Opinion by">Opinion by</option>
              <option value="Investigation by">Investigation by</option>
              <option value="Edited by">Edited by</option>
              <option value="Interview by">Interview by</option>
              <option value="Compiled by">Compiled by</option>
              <option value="__custom__">Custom…</option>
            </select>
            {form.byline_label === "__custom__" && (
              <input
                className={`${inputClass} mt-2`}
                style={inputStyle}
                placeholder="Custom label, e.g. Fact-check by"
                onChange={(e) => set("byline_label", e.target.value)}
              />
            )}
          </div>
          <div>
            <label className="dateline block mb-1">Name(s)</label>
            <input
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Raj, or a wire service name"
              value={form.byline_name}
              onChange={(e) => set("byline_name", e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
          Preview: <strong>{form.byline_label === "__custom__" ? "Label" : form.byline_label} {form.byline_name || "Name"}</strong>
        </p>
      </fieldset>

      <div>
        <label className="dateline block mb-1">Cover image</label>
        <div className="flex gap-2 items-center">
          <input className={inputClass} style={inputStyle} placeholder="Image URL" value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} />
          <label className="dateline border rounded px-3 py-2 cursor-pointer whitespace-nowrap" style={inputStyle}>
            {uploading ? "Uploading…" : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0])} />
          </label>
        </div>
        {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
        {form.cover_image && <img src={form.cover_image} alt="" className="mt-2 h-24 object-cover rounded" />}
      </div>

      <div>
        <label className="dateline block mb-1">YouTube video URL (optional)</label>
        <input className={inputClass} style={inputStyle} value={form.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
      </div>

      <div>
        <label className="dateline block mb-1">Tags (comma separated)</label>
        <input className={inputClass} style={inputStyle} value={form.tags} onChange={(e) => set("tags", e.target.value)} />
      </div>

      <fieldset className="border rounded-lg p-4" style={inputStyle}>
        <legend className="dateline px-1">Source attribution</legend>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <input className={inputClass} style={inputStyle} placeholder="Source name (e.g. Reuters)" value={form.source_name} onChange={(e) => set("source_name", e.target.value)} />
          <input className={inputClass} style={inputStyle} placeholder="Source URL" value={form.source_url} onChange={(e) => set("source_url", e.target.value)} />
        </div>
        <input className={inputClass} style={inputStyle} placeholder="Credit line (optional)" value={form.source_credit} onChange={(e) => set("source_credit", e.target.value)} />
      </fieldset>

      <div className="grid grid-cols-3 gap-4 items-end">
        <div>
          <label className="dateline block mb-1">Status</label>
          <select className={inputClass} style={inputStyle} value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured (homepage hero)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.breaking} onChange={(e) => set("breaking", e.target.checked)} />
          Breaking (ticker)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 items-center">
        <button disabled={saving} className="rounded-full px-5 py-2 text-sm text-white" style={{ background: "var(--ink)" }}>
          {saving ? "Saving…" : isNew ? "Publish / Save" : "Save changes"}
        </button>
        {!isNew && (
          <button type="button" onClick={remove} className="text-sm" style={{ color: "var(--signal)" }}>
            Delete article
          </button>
        )}
      </div>
    </form>
  );
}
