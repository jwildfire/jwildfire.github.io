#!/usr/bin/env node
// Step 1 of 2: read the roadmap from GitHub and save a trimmed snapshot beside this file.
//
// The read is the obot.roadmap tracker's own collector (scripts/lib/collect/tracker.mjs:
// fetchTracker() then buildTracker()), imported from a local checkout of the hub, so a
// requirement's status and a task's state here are exactly what the tracker page shows:
// https://jwildfire.github.io/obot.roadmap/tracker.html
//
//   GITHUB_TOKEN=... node fetch.mjs          (see README.md for where the token comes from)
//
// Writes model.json: objectives -> requirements -> tasks, with public issue numbers and
// titles for objectives and requirements, and only a state for each task. Nothing else from
// the API response is kept, and the token is read from the environment and never written.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HUB = process.env.OBOT_ROADMAP || '/Users/jwildfire/Documents/obot2/obot.roadmap';

if (!process.env.GITHUB_TOKEN && !process.env.GH_TOKEN) {
  console.error('fetch: set GITHUB_TOKEN for this one command (README.md says how). Nothing was read or written.');
  process.exit(1);
}

const { fetchTracker, buildTracker } = await import(pathToFileURL(path.join(HUB, 'scripts/lib/collect/tracker.mjs')).href);
const now = new Date();
const m = buildTracker(await fetchTracker());
if (!m.objectives.length) throw new Error('fetch: no objectives came back; refusing to overwrite model.json');

const short = (title) => title.split(' — ')[0].trim();
const req = (r) => ({ n: r.number, title: r.title, stage: r.stage, tasks: r.tasks.map((t) => t.phase) });
const inZone = (opts) => new Intl.DateTimeFormat('en-GB', { timeZone: 'America/New_York', ...opts }).format(now);

const model = {
  source: 'jwildfire/obot.roadmap, read through scripts/lib/collect/tracker.mjs',
  readAt: now.toISOString(),
  // The date printed on the slides, in Eastern time: "5 October 2026".
  asOf: inZone({ day: 'numeric', month: 'long', year: 'numeric' }),
  asOfTime: `${inZone({ hour: '2-digit', minute: '2-digit', hour12: false })} Eastern`,
  totals: m.totals,
  objectives: m.objectives.map((o) => ({ number: o.number, title: o.title, short: short(o.title), state: o.state, requirements: o.requirements.map(req) })),
  unparented: m.unparented.map(req),
};

await fs.writeFile(path.join(HERE, 'model.json'), JSON.stringify(model, null, 1) + '\n');
const t = m.totals, s = t.requirements.byStage;
console.log(`fetch: ${model.asOf}, ${model.asOfTime}`);
console.log(`  ${t.objectives.total} objectives; ${t.requirements.total} requirements (${Object.keys(s).filter((k) => s[k]).map((k) => `${s[k]} ${k.toLowerCase()}`).join(', ')}); ${t.tasks.total} tasks (${t.tasks.done} done, ${t.tasks.inReview} in review, ${t.tasks.open} open, ${t.tasks.retired} retired); ${t.unparented} requirements under no objective`);
console.log('  wrote model.json — now run: node build.mjs --inject ../beat4-roadmap-tree-draft.html');
