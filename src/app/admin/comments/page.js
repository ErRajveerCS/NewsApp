import { query } from "@/lib/db";
import CommentModerationRow from "@/components/CommentModerationRow";

export const dynamic = "force-dynamic";

export default async function CommentsAdminPage() {
  const comments = await query(
    `SELECT comments.*, articles.title as article_title, articles.slug as article_slug
     FROM comments JOIN articles ON comments.article_id = articles.id
     ORDER BY comments.approved ASC, comments.created_at DESC`
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Comments</h1>
      <div className="border rounded-lg divide-y" style={{ borderColor: "var(--hairline)" }}>
        {comments.map((c) => (
          <CommentModerationRow key={c.id} comment={c} />
        ))}
        {comments.length === 0 && <p className="p-4 text-sm dateline">No comments yet.</p>}
      </div>
    </div>
  );
}
