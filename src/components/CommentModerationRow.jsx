"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CommentModerationRow({ comment }) {
  const router = useRouter();

  async function setApproved(approved) {
    await fetch(`/api/admin/comments/${comment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this comment?")) return;
    await fetch(`/api/admin/comments/${comment.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="px-4 py-3 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{comment.name}</div>
        <p className="text-sm mt-1">{comment.body}</p>
        <div className="dateline mt-1">
          On{" "}
          <Link href={`/article/${comment.article_slug}`} target="_blank" className="wire-link">
            {comment.article_title}
          </Link>{" "}
          · {comment.approved ? "Approved" : "Pending"}
        </div>
      </div>
      <div className="flex gap-3 text-sm shrink-0">
        {!comment.approved && (
          <button onClick={() => setApproved(true)} style={{ color: "var(--wire)" }}>Approve</button>
        )}
        {comment.approved ? (
          <button onClick={() => setApproved(false)} className="dateline">Unapprove</button>
        ) : null}
        <button onClick={remove} style={{ color: "var(--signal)" }}>Delete</button>
      </div>
    </div>
  );
}
