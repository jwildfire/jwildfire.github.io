// A second count of two of the AI marks, from GitHub's search API with no login:
// issues and pull requests whose body contains the phrase "drafted by", and pull requests reviewed by
// the Copilot reviewer account. Compared with ai-adoption-data.json. Writes crosscheck-ai.json.
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const D = JSON.parse(fs.readFileSync(process.argv[2] || (dir + 'ai-adoption-data.json'), 'utf8'));
const SCOPE = 'org:Gilead-Public org:Gilead-BioStats org:OpenRBQM -repo:Gilead-Public/Open-SMART-PMI -repo:Gilead-Public/CLAIRE -repo:OpenRBQM/openRBQM-workshop-EU25';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function total(q) { for (;;) { const res = await fetch('https://api.github.com/search/issues?per_page=1&q=' + encodeURIComponent(q), { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'keynote-ai-adoption-count' } }); if (res.status === 403 || res.status === 429) { await sleep(Math.max(2000, +res.headers.get('x-ratelimit-reset') * 1000 - Date.now() + 1500)); continue; } return (await res.json()).total_count; } }
const started = new Date().toISOString(), rows = [];
const R = { '2025': ['2025-01-01..2025-12-31', ['2025Q1', '2025Q2', '2025Q3', '2025Q4']], '2026Q1': ['2026-01-01..2026-03-31', ['2026Q1']], '2026Q2': ['2026-04-01..2026-06-30', ['2026Q2']], '2026Q3': ['2026-07-01..2026-09-30', ['2026Q3']] };
for (const [k, [range, qs]] of Object.entries(R)) {
  for (const [kind, is, src] of [['pull requests with "drafted by" in the body', 'is:pr', 'prs_by_quarter'], ['issues with "drafted by" in the body', 'is:issue', 'issues_by_quarter']]) {
    const query = `${is} created:${range} "drafted by" in:body`;
    rows.push({ window: k, what: kind, search_total_count: await total(`${SCOPE} ${query}`), counted_from_fetch: qs.reduce((a, q) => a + D.ai_evidence[src][q].attribution_line, 0), query });
  }
  const query = `is:pr created:${range} reviewed-by:copilot-pull-request-reviewer[bot]`;
  rows.push({ window: k, what: 'pull requests reviewed by Copilot', search_total_count: await total(`${SCOPE} ${query}`), counted_from_fetch: qs.reduce((a, q) => a + D.ai_evidence.prs_by_quarter[q].copilot_review, 0), query });
}
for (const r of rows) console.log(r.window, r.what, r.search_total_count, r.counted_from_fetch, r.search_total_count === r.counted_from_fetch ? 'ok' : 'differs');
fs.writeFileSync(dir + 'crosscheck-ai.json', JSON.stringify({ started, finished: new Date().toISOString(), scope: SCOPE, note: 'The search matches the bare phrase "drafted by" and includes items opened by bots, so it can exceed the fetch count, which needs an AI tool named after the phrase and leaves bots out.', rows }, null, 1));
