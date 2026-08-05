import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

let client = null;

function getClient() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:./data/news.db",
      authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    });
  }
  return client;
}

function toPlain(rows) {
  return rows.map((r) => {
    const obj = {};
    for (const key of Object.keys(r)) {
      const val = r[key];
      obj[key] = typeof val === "bigint" ? Number(val) : val;
    }
    return obj;
  });
}

/** Run a SELECT and get back plain-object rows. */
export async function query(sql, args = []) {
  await ensureReady();
  const result = await getClient().execute({ sql, args });
  return toPlain(result.rows);
}

/** Run a single-row SELECT. */
export async function queryOne(sql, args = []) {
  const rows = await query(sql, args);
  return rows[0] || null;
}

/** Run an INSERT/UPDATE/DELETE. Returns { lastInsertRowid, rowsAffected }. */
export async function run(sql, args = []) {
  await ensureReady();
  const result = await getClient().execute({ sql, args });
  return {
    lastInsertRowid:
      typeof result.lastInsertRowid === "bigint"
        ? Number(result.lastInsertRowid)
        : result.lastInsertRowid,
    rowsAffected: result.rowsAffected,
  };
}

let initPromise = null;

/** Create tables and seed defaults, exactly once, on first use. */
export function ensureReady() {
  if (!initPromise) {
    initPromise = (async () => {
      await getClient().execute(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        bio TEXT DEFAULT '',
        photo TEXT DEFAULT '',
        twitter TEXT DEFAULT '',
        linkedin TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      )`);

      await getClient().execute(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL
      )`);

      await getClient().execute(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT DEFAULT '',
        content TEXT NOT NULL,
        cover_image TEXT DEFAULT '',
        youtube_url TEXT DEFAULT '',
        category_id INTEGER,
        author_id INTEGER,
        status TEXT NOT NULL DEFAULT 'draft',
        featured INTEGER NOT NULL DEFAULT 0,
        breaking INTEGER NOT NULL DEFAULT 0,
        tags TEXT DEFAULT '',
        source_name TEXT DEFAULT '',
        source_url TEXT DEFAULT '',
        source_credit TEXT DEFAULT '',
        views INTEGER NOT NULL DEFAULT 0,
        published_at TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (author_id) REFERENCES users(id)
      )`);

      await getClient().execute(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        body TEXT NOT NULL,
        approved INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (article_id) REFERENCES articles(id)
      )`);

      await getClient().execute(`CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )`);

      const defaultCategories = ["National", "World", "Business", "Technology", "Sports", "Entertainment", "Video News", "Health", "Education", "Politics", "Science", "Lifestyle", "Opinion", "Fact Check"];
      for (const c of defaultCategories) {
        const slug = c.toLowerCase().replace(/\s+/g, "-");
        await getClient().execute({
          sql: "INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)",
          args: [c, slug],
        });
      }

      // Migration: add byline columns if this database was created before they existed.
      const columns = await getClient().execute("PRAGMA table_info(articles)");
      const columnNames = columns.rows.map((r) => r.name);
      if (!columnNames.includes("byline_label")) {
        await getClient().execute("ALTER TABLE articles ADD COLUMN byline_label TEXT DEFAULT ''");
      }
      if (!columnNames.includes("byline_name")) {
        await getClient().execute("ALTER TABLE articles ADD COLUMN byline_name TEXT DEFAULT ''");
      }

      const adminEmail = "admin@example.com";
      const existing = await getClient().execute({
        sql: "SELECT id FROM users WHERE email = ?",
        args: [adminEmail],
      });
      if (existing.rows.length === 0) {
        const hash = bcrypt.hashSync("changeme123", 10);
        await getClient().execute({
          sql: "INSERT INTO users (name, email, password_hash, role, bio) VALUES (?, ?, ?, 'admin', ?)",
          args: ["Raj", adminEmail, hash, "Founder & Editor-in-Chief"],
        });
      }
    })();
  }
  return initPromise;
}
