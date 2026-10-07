// A second, independent count of the quarterly figures for all 25 repositories: GitHub's search API,
// with no login (so only public items can be seen), compared with the figures in ai-adoption-data.json.
// 10 searches a minute without a login, so this takes about six minutes. Writes crosscheck.json.
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const data = JSON.parse(fs.readFileSync(process.argv[2] || (dir + 'ai-adoption-data.json'), 'utf8'));
const SCOPE = 'org:Gilead-Public org:Gilead-BioStats org:OpenRBQM -repo:Gilead-Public/Open-SMART-PMI -repo:Gilead-Public/CLAIRE -repo:OpenRBQM/openRBQM-workshop-EU25';
const NOBOTS = ' -author:app/dependabot -author:app/github-actions -author:app/cm-operations-bot -author:app/ci-gh-app';
const WHAT = { issues_opened: 'is:issue created', issues_closed: 'is:issue closed', prs_opened: 'is:pr created', prs_merged: 'is:pr merged' };
const Q = { '2025Q1': '2025-01-01..2025-03-31', '2025Q2': '2025-04-01..2025-06-30', '2025Q3': '2025-07-01..2025-09-30', '2025Q4': '2025-10-01..2025-12-31', '2026Q1': '2026-01-01..2026-03-31', '2026Q2': '2026-04-01..2026-06-30', '2026Q3': '2026-07-01..2026-09-30' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function total(q) {
  for (;;) {
    const res = await fetch('https://api.github.com/search/issues?per_page=1&q=' + encodeURIComponent(q), { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'keynote-ai-adoption-count' } });
    if (res.status === 403 || res.status === 429) { const reset = +res.headers.get('x-ratelimit-reset') * 1000; await sleep(Math.max(2000, reset - Date.now() + 1500)); continue; }
    if (!res.ok) throw new Error(res.status + ' ' + (await res.text()).slice(0, 200));
    const j = await res.json();
    if (j.incomplete_results) throw new Error('incomplete results for ' + q);
    return j.total_count;
  }
}
const started = new Date().toISOString();
const rows = []; let bad = 0;
for (const v of ['no_bots', 'with_bots']) for (const [m, what] of Object.entries(WHAT)) for (const [q, range] of Object.entries(Q)) {
  const query = `${SCOPE} ${what}:${range}${v === 'no_bots' ? NOBOTS : ''}`;
  const search = await total(query), mine = data.quarterly.all_25[v][q][m];
  if (search !== mine) bad++;
  rows.push({ variant: v, measure: m, quarter: q, search_total_count: search, counted_from_fetch: mine, match: search === mine, query });
  console.log(v, m, q, search, mine, search === mine ? 'ok' : 'MISMATCH');
}
fs.writeFileSync(dir + 'crosscheck.json', JSON.stringify({ started, finished: new Date().toISOString(), mismatches: bad, rows }, null, 1));
console.log('mismatches', bad, 'of', rows.length, started, new Date().toISOString());
