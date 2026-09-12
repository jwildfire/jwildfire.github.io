#!/usr/bin/env node
/*
 * Sync the homepage release feed (_data/releases.yml) with GitHub releases.
 *
 * Run by .github/workflows/sync-releases.yml on a schedule. For every tracked
 * package it lists the published releases on GitHub, and appends any tag the
 * data file does not already carry: date from the release, a draft blurb from
 * the first sentence of the release notes, a Notes link to the release page, a
 * Demo link to the package's site, and a Walkthrough link when the notes open
 * with an annotated demo. Entries are inserted at the top of the package's
 * section so the file stays newest-first and hand-written entries are untouched.
 *
 * The blurb is a starting point: the workflow opens a pull request so it can be
 * tightened by hand before the release shows on the site.
 *
 *   node scripts/sync-releases.mjs             # update the data file in place
 *   node scripts/sync-releases.mjs --dry-run   # print the entries, change nothing
 *
 * Environment: GITHUB_TOKEN (optional, raises the API rate limit),
 * SYNC_RELEASES_FIXTURE (a JSON file of {package: [release, ...]} used instead
 * of the API, for tests), SYNC_RELEASES_SUMMARY (path to write a Markdown
 * summary for the pull request body).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const TRACKED = [
  { package: "safety.viz", repo: "jwildfire/safety.viz", demo: "https://jwildfire.github.io/safety.viz/" },
  { package: "gsm.safety", repo: "jwildfire/gsm.safety", demo: "https://jwildfire.github.io/gsm.safety/" },
];

const BLURB_MAX = 110;

const here = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(here, "..", "_data", "releases.yml");
const dryRun = process.argv.includes("--dry-run");

// --- Read what the feed already has -----------------------------------------

const yaml = readFileSync(DATA_FILE, "utf8");

function knownVersions(text) {
  const known = new Set();
  const re = /^- package:\s*(\S+)\s*\n\s+version:\s*(\S+)/gm;
  let m;
  while ((m = re.exec(text))) known.add(`${m[1]}@${m[2]}`);
  return known;
}

// --- Fetch releases -----------------------------------------------------------

async function fetchReleases(repo) {
  if (process.env.SYNC_RELEASES_FIXTURE) {
    const fixture = JSON.parse(readFileSync(process.env.SYNC_RELEASES_FIXTURE, "utf8"));
    return fixture[repo] || [];
  }
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "wildfiring-sync-releases" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${repo}: ${await res.text()}`);
  return res.json();
}

// --- Turn release notes into a one-line draft blurb ---------------------------

function stripMarkdown(s) {
  return s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/(^|\s)[*_]([^*_]+)[*_](?=[\s.,;:!?]|$)/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(s) {
  // Break on a period, exclamation or question mark followed by a space and a
  // capital letter, so "v1.2.0" and "e.g." do not end the sentence early.
  const m = /^(.+?[.!?])(?=\s+[A-Z"(])/.exec(s);
  return (m ? m[1] : s).replace(/[.:;,]\s*$/, "");
}

function truncate(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[.:;,]\s*$/, "") + "…";
}

function draftBlurb(body) {
  const paragraphs = (body || "")
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  let firstBullet = "";
  for (const p of paragraphs) {
    if (/^#/.test(p)) continue; // heading
    if (/^\*\*see it move/i.test(p)) continue; // demo pointer, captured as a link instead
    if (/^\|/.test(p) || /^```/.test(p)) continue; // table, code
    if (/^[-*]\s/.test(p)) {
      // Notes that are only a bullet list: remember the first item as a fallback.
      if (!firstBullet) firstBullet = stripMarkdown(p.split("\n")[0].replace(/^[-*]\s+/, ""));
      continue;
    }
    const text = stripMarkdown(p);
    if (text.length < 20) continue;
    return truncate(firstSentence(text), BLURB_MAX);
  }
  return firstBullet ? truncate(firstSentence(firstBullet), BLURB_MAX) : "";
}

function walkthroughLink(body) {
  const m = /\*\*see it move:?\*\*[^\n]*?\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i.exec(body || "");
  return m ? m[1] : null;
}

// --- Build and insert YAML entries -------------------------------------------

function yamlString(s) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function entryYaml(e) {
  const lines = [
    `- package: ${e.package}`,
    `  version: ${e.version}`,
    `  date: ${e.date}`,
    `  blurb: ${yamlString(e.blurb)}`,
    `  links:`,
  ];
  for (const l of e.links) lines.push(`    - label: ${l.label}`, `      url: ${l.url}`);
  return lines.join("\n") + "\n";
}

function insertEntries(text, pkg, entries) {
  if (!entries.length) return text;
  const block = entries.map(entryYaml).join("\n");
  const header = new RegExp(`^# ${pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*-{3,}[^\\n]*\\n`, "m");
  const m = header.exec(text);
  if (m) {
    // Insert at the top of the package's section: after the header line and the
    // blank line that follows it, ahead of the newest existing entry.
    let at = m.index + m[0].length;
    if (text[at] === "\n") at += 1;
    return text.slice(0, at) + block + "\n" + text.slice(at);
  }
  // No section yet: add one at the end of the file.
  const rule = "-".repeat(Math.max(3, 78 - pkg.length - 3));
  return text.replace(/\s*$/, "\n") + `\n# ${pkg} ${rule}\n\n` + block;
}

// --- Main ---------------------------------------------------------------------

const known = knownVersions(yaml);
let text = yaml;
const added = [];

for (const t of TRACKED) {
  const releases = await fetchReleases(t.repo);
  const fresh = releases
    .filter((r) => !r.draft && !r.prerelease && r.published_at)
    .filter((r) => !known.has(`${t.package}@${r.tag_name}`))
    .sort((a, b) => (a.published_at < b.published_at ? 1 : -1)); // newest first
  const entries = fresh.map((r) => {
    const links = [
      { label: "Notes", url: r.html_url },
      { label: "Demo", url: t.demo },
    ];
    const walk = walkthroughLink(r.body);
    if (walk) links.push({ label: "Walkthrough", url: walk });
    return {
      package: t.package,
      version: r.tag_name,
      date: r.published_at.slice(0, 10),
      blurb: draftBlurb(r.body) || `${r.name || r.tag_name} (edit this blurb)`,
      links,
    };
  });
  text = insertEntries(text, t.package, entries);
  added.push(...entries);
}

if (!added.length) {
  console.log("Release feed is up to date.");
} else {
  for (const e of added) console.log(`+ ${e.package} ${e.version} (${e.date}) — ${e.blurb}`);
  if (dryRun) {
    console.log(`\n${added.length} entr${added.length === 1 ? "y" : "ies"} would be added (dry run).`);
  } else {
    writeFileSync(DATA_FILE, text);
    console.log(`\nAdded ${added.length} entr${added.length === 1 ? "y" : "ies"} to ${DATA_FILE}.`);
  }
}

if (process.env.SYNC_RELEASES_SUMMARY) {
  const lines = added.length
    ? [
        `New releases for the homepage feed. The blurbs are drafted from the first sentence of each release's notes — tighten them to one line (about ${BLURB_MAX} characters) before merging.`,
        "",
        ...added.map(
          (e) => `- **${e.package} ${e.version}** (${e.date}) — ${e.blurb} · ${e.links.map((l) => `[${l.label}](${l.url})`).join(" · ")}`
        ),
      ]
    : ["No new releases."];
  writeFileSync(process.env.SYNC_RELEASES_SUMMARY, lines.join("\n") + "\n");
}

if (process.env.GITHUB_OUTPUT) {
  writeFileSync(process.env.GITHUB_OUTPUT, `count=${added.length}\n`, { flag: "a" });
}
