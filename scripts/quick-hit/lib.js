/*
 * Quick hit file format: turns what the popup collected into the Markdown file
 * that lands in _links/ (see _config.yml, collections.links). Pure functions, no
 * browser APIs, so `node --test` can exercise them (lib.test.js).
 *
 *   _links/2026-10-18-the-slug.md
 *   ---
 *   title: "Page title"
 *   link: "https://example.com/article"
 *   source: "example.com"
 *   date: 2026-10-18 09:12:00 -0400
 *   quote: "The highlighted passage, if any."
 *   ---
 *   The comment, in Markdown.
 *
 * Strings are written as JSON strings, which YAML reads as double-quoted
 * scalars, so quotes, colons and newlines in a title or quote need no special
 * handling.
 */

// Query parameters that only track where a click came from.
const TRACKING = /^(utm_[a-z]+|fbclid|gclid|dclid|mc_[a-z]+|igshid|ref_src|ref_url|_hsenc|_hsmi|mkt_tok|si)$/i;

/** The URL with tracking parameters and text-fragment anchors removed. */
export function cleanUrl(raw) {
  let u;
  try { u = new URL(raw); } catch { return String(raw || "").trim(); }
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING.test(key)) u.searchParams.delete(key);
  }
  // Chrome's "copy link to highlight" fragments (#:~:text=...) are not part of the page.
  if (u.hash.startsWith("#:~:")) u.hash = "";
  return u.toString();
}

/** A readable source name for a URL: its host without "www.". */
export function sourceFromUrl(raw) {
  try { return new URL(raw).hostname.replace(/^www\./, ""); } catch { return ""; }
}

/** A filename slug from a title: lowercase ASCII words joined by hyphens, at most ~60 characters. */
export function slugify(title) {
  const words = String(title || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  let slug = "";
  for (const w of words) {
    const next = slug ? `${slug}-${w}` : w;
    if (next.length > 60 && slug) break;
    slug = next.slice(0, 60);
  }
  return slug || "link";
}

const pad = (n) => String(n).padStart(2, "0");

/** The local date as YYYY-MM-DD (for the filename) and as a Jekyll timestamp with offset. */
export function dateParts(d = new Date()) {
  const ymd = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const zone = `${sign}${pad(Math.floor(Math.abs(off) / 60))}${pad(Math.abs(off) % 60)}`;
  const stamp = `${ymd} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${zone}`;
  return { ymd, stamp };
}

/**
 * The comment as a safe file body. Jekyll runs Liquid over the body, so text with
 * {{ or {% is wrapped in a raw block; and the site's titles_from_headings plugin
 * would take a leading heading as the page title, so a leading # is escaped.
 */
export function safeBody(comment) {
  let body = String(comment || "").replace(/\r\n?/g, "\n").trim();
  if (!body) return "";
  if (body.startsWith("#")) body = "\\" + body;
  if (/\{[{%]/.test(body)) {
    body = `{% raw %}${body.replace(/\{%-?\s*endraw\s*-?%\}/g, "{&#37; endraw &#37;}")}{% endraw %}`;
  }
  return body;
}

/** The whole Markdown file for one quick hit. */
export function buildFile({ title, link, source, quote, comment, date = new Date(), draft = false }) {
  const t = String(title || "").replace(/\s+/g, " ").trim();
  if (!t) throw new Error("A quick hit needs a title.");
  const url = String(link || "").trim();
  if (!/^https?:\/\//i.test(url)) throw new Error("A quick hit needs an http(s) link.");
  const q = String(quote || "").replace(/\r\n?/g, "\n").trim();
  const s = String(source || "").trim();
  const lines = [
    "---",
    `title: ${JSON.stringify(t)}`,
    `link: ${JSON.stringify(url)}`,
  ];
  if (s) lines.push(`source: ${JSON.stringify(s)}`);
  lines.push(`date: ${dateParts(date).stamp}`);
  if (q) lines.push(`quote: ${JSON.stringify(q)}`);
  if (draft) lines.push("published: false");
  lines.push("---", "");
  const body = safeBody(comment);
  return lines.join("\n") + (body ? body + "\n" : "");
}

/** Repo path for a quick hit; n > 1 adds a suffix when the first name is taken. */
export function filePath(title, date = new Date(), n = 1) {
  const slug = slugify(title) + (n > 1 ? `-${n}` : "");
  return { path: `_links/${dateParts(date).ymd}-${slug}.md`, slug };
}

/** Where the quick hit's own page will be once the site rebuilds. */
export function permalink(siteUrl, date, slug) {
  const [y, m, d] = dateParts(date).ymd.split("-");
  return `${String(siteUrl).replace(/\/+$/, "")}/links/${y}/${m}/${d}/${slug}/`;
}

/** Base64 of a string's UTF-8 bytes, as the GitHub contents API expects. */
export function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}
