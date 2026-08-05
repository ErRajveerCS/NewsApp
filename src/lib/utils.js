export function youtubeId(url) {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/**
 * Safely parse timestamps from the database. Some come as full ISO strings
 * already ending in "Z" (e.g. published_at, set via new Date().toISOString()),
 * others as SQLite's plain "YYYY-MM-DD HH:MM:SS" (e.g. created_at, from
 * datetime('now')), which needs "Z" appended to parse as UTC. Blindly
 * appending "Z" to both produces "...Z Z" and an Invalid Date.
 */
export function parseDate(value) {
  if (!value) return null;
  const hasTimezoneInfo = /[zZ]|[+-]\d\d:?\d\d$/.test(value);
  const isoLike = value.includes("T") || hasTimezoneInfo;
  const d = new Date(isoLike ? value : value.replace(" ", "T") + "Z");
  return isNaN(d.getTime()) ? null : d;
}
