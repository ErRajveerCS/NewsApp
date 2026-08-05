import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#14181f";
const PAPER = "#fafaf8";
const SIGNAL = "#c81d25";
const WIRE = "#0f6b66";
const MUTED = "#9aa0aa";

const SUPPORTED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

async function validateImage(url) {
  if (!url) return null;
  if (url.startsWith("data:image")) return url; // our own uploads, always safe
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const type = res.headers.get("content-type")?.split(";")[0];
    return SUPPORTED_TYPES.includes(type) ? url : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  const title = article?.title || "The Daily Wire Desk";
  const category = (article?.category_name || "").toUpperCase();
  const tags = (article?.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);
  const dateStr = article?.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const rawBg = article?.cover_image && article.cover_image.startsWith("http")
    ? article.cover_image
    : article?.cover_image?.startsWith("data:image")
    ? article.cover_image
    : null;

  const bg = await validateImage(rawBg);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: INK,
          fontFamily: "sans-serif",
        }}
      >
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bg}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: "cover",
            }}
          />
        )}
        {bg && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              display: "flex",
              background:
                "linear-gradient(180deg, rgba(20,24,31,0.45) 0%, rgba(20,24,31,0.94) 80%)",
            }}
          />
        )}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            ...(!bg && {
              backgroundImage: "linear-gradient(135deg, #14181f 0%, #1c2430 100%)",
            }),
          }}
        >
        {/* Masthead */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              borderBottom: `2px solid ${SIGNAL}`,
              paddingBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 22,
                letterSpacing: 6,
                color: PAPER,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              The Daily Wire Desk
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {category && (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                letterSpacing: 3,
                color: WIRE,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 48 : 60,
              lineHeight: 1.15,
              color: PAPER,
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 12 }}>
              {tags.map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    fontSize: 20,
                    color: PAPER,
                    border: `1px solid ${MUTED}`,
                    borderRadius: 999,
                    padding: "8px 20px",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${MUTED}`,
            paddingTop: 20,
            fontSize: 22,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>thedailywiredesk.com</div>
          <div style={{ display: "flex" }}>{dateStr}</div>
        </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
