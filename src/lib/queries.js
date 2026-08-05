import { query, queryOne, run } from "./db";
import slugify from "slugify";

export async function makeSlug(title) {
  const base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let i = 1;
  while (await queryOne("SELECT id FROM articles WHERE slug = ?", [slug])) {
    slug = `${base}-${++i}`;
  }
  return slug;
}

export async function getCategories() {
  return query("SELECT * FROM categories ORDER BY name");
}

export async function getCategoryBySlug(slug) {
  return queryOne("SELECT * FROM categories WHERE slug = ?", [slug]);
}

export async function getPublishedArticles({ limit = 20, offset = 0, categorySlug, search } = {}) {
  let where = "a.status = 'published'";
  const params = [];
  if (categorySlug) {
    where += " AND c.slug = ?";
    params.push(categorySlug);
  }
  if (search) {
    where += " AND (a.title LIKE ? OR a.summary LIKE ? OR a.tags LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  return query(
    `SELECT a.*, c.name as category_name, c.slug as category_slug, u.name as author_name
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     LEFT JOIN users u ON a.author_id = u.id
     WHERE ${where}
     ORDER BY a.published_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
}

export async function getFeatured(limit = 5) {
  return query(
    `SELECT a.*, c.name as category_name, c.slug as category_slug, u.name as author_name
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     LEFT JOIN users u ON a.author_id = u.id
     WHERE a.status = 'published' AND a.featured = 1
     ORDER BY a.published_at DESC LIMIT ?`,
    [limit]
  );
}

export async function getBreaking(limit = 5) {
  return query(
    `SELECT a.* FROM articles a WHERE a.status = 'published' AND a.breaking = 1
     ORDER BY a.published_at DESC LIMIT ?`,
    [limit]
  );
}

export async function getTrending(limit = 5) {
  return query(
    `SELECT a.*, c.name as category_name, c.slug as category_slug
     FROM articles a LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.status = 'published' ORDER BY a.views DESC LIMIT ?`,
    [limit]
  );
}

export async function getArticleBySlug(slug) {
  return queryOne(
    `SELECT a.*, c.name as category_name, c.slug as category_slug,
            u.name as author_name, u.bio as author_bio, u.photo as author_photo,
            u.twitter as author_twitter, u.linkedin as author_linkedin
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     LEFT JOIN users u ON a.author_id = u.id
     WHERE a.slug = ?`,
    [slug]
  );
}

export async function incrementViews(id) {
  return run("UPDATE articles SET views = views + 1 WHERE id = ?", [id]);
}

export async function getRelated(categoryId, excludeId, limit = 4) {
  return query(
    `SELECT * FROM articles WHERE category_id = ? AND id != ? AND status = 'published'
     ORDER BY published_at DESC LIMIT ?`,
    [categoryId, excludeId, limit]
  );
}

export async function getApprovedComments(articleId) {
  return query(
    "SELECT * FROM comments WHERE article_id = ? AND approved = 1 ORDER BY created_at DESC",
    [articleId]
  );
}

export async function getAllArticlesAdmin() {
  return query(
    `SELECT a.*, c.name as category_name, u.name as author_name
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     LEFT JOIN users u ON a.author_id = u.id
     ORDER BY a.created_at DESC`
  );
}

export async function getAuthors() {
  return query("SELECT * FROM users ORDER BY name");
}

export async function getAuthorArticles(authorId) {
  return query(
    `SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.author_id = ? AND a.status = 'published' ORDER BY a.published_at DESC`,
    [authorId]
  );
}
