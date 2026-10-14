// Turn raw.json (issues, pull requests, releases, comments), commits.json (commit trailers),
// prcommits.json (which commits belong to which pull request) and tests.json into
// ai-adoption-data.json, and print every table in ai-adoption-findings.md.
// Dates are UTC. Nothing on or after 2026-10-07 is counted. No account names are written out.
//
//   node ai-adoption-analyze.mjs [out.json]
import fs from 'node:fs';
import { REPOS } from './ai-adoption-repos.mjs';
const dir = new URL('.', import.meta.url).pathname;
const raw = JSON.parse(fs.readFileSync(dir + 'raw.json', 'utf8'));
const CM = JSON.parse(fs.readFileSync(dir + 'commits.json', 'utf8'));
const PRC = JSON.parse(fs.readFileSync(dir + 'prcommits.json', 'utf8'));
const TESTS = JSON.parse(fs.readFileSync(dir + 'tests.json', 'utf8'));
const OUT = process.argv[2] || (dir + 'ai-adoption-data.json');
for (const f of REPOS) if (!raw.repos[f] || raw.repos[f].err) throw new Error('missing or failed fetch: ' + f + ' ' + (raw.repos[f] && raw.repos[f].err));

// ---------------------------------------------------------------- definitions
const CUT = '2026-10-07';
const QUARTERS = ['2025Q1', '2025Q2', '2025Q3', '2025Q4', '2026Q1', '2026Q2', '2026Q3'];
const qOf = d => `${d.slice(0, 4)}Q${Math.ceil(+d.slice(5, 7) / 3)}`;
const MONTHS = []; for (let y = 2025; y <= 2026; y++) for (let m = 1; m <= 12; m++) { const k = `${y}-${String(m).padStart(2, '0')}`; if (k <= '2026-09') MONTHS.push(k); }
const MEASURES = ['issues_opened', 'issues_closed', 'prs_opened', 'prs_merged', 'releases'];
const isBot = x => x.utype === 'Bot' || /\[bot\]$/.test(x.user || '');
// A coding agent's own account, as opposed to a dependency or workflow bot.
const AGENT_ACCOUNT = /^(copilot|copilot-swe-agent|claude|claude-code|codex|openai-codex|chatgpt-codex-connector|cursor|cursoragent|devin-ai-integration|google-labs-jules|sweep-ai)(\[bot\])?$/i;
const isVersionTag = t => /^v?\d+\.\d+/.test(t);
// The team's attribution line, e.g. "This PR was drafted by Claude Code using Opus 4.8 and reviewed by @x",
// plus the tools' own footers.
const ATTRIB = /\bdrafted by\b[^\n]{0,40}\b(claude|copilot|posit assistant|codex|gpt|cursor|gemini|assistant|agent)\b/i;
const TOOL_FOOTER = /generated with \[?claude code|co-authored-by:\s*(claude|copilot)|🤖 generated with|created by (github )?copilot|opened by copilot/i;
const AI_WORD = /\b(claude|copilot|codex|chatgpt|gpt-\d|openai|anthropic|cursor agent|gemini)\b/i;
const pct = (a, b) => a === 0 ? null : Math.sign(b - a) * Math.round(Math.abs(b / a - 1) * 1000) / 10;
const share = (n, d) => d === 0 ? null : Math.round(n / d * 1000) / 10;
const median = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r1 = x => x === null ? null : Math.round(x * 10) / 10;

// ---------------------------------------------------------------- events
const events = [];   // {repo, m, d, bot, user}
for (const full of REPOS) {
  const r = raw.repos[full];
  for (const x of r.releases) if (!x.draft && x.published && isVersionTag(x.tag)) events.push({ repo: full, m: 'releases', d: x.published, bot: false, user: null });
  for (const i of r.issues) { const bot = isBot(i); events.push({ repo: full, m: 'issues_opened', d: i.created, bot, user: i.user }); if (i.closed) events.push({ repo: full, m: 'issues_closed', d: i.closed, bot, user: i.user }); }
  for (const p of r.prs) { const bot = isBot(p); events.push({ repo: full, m: 'prs_opened', d: p.created, bot, user: p.user }); if (p.merged) events.push({ repo: full, m: 'prs_merged', d: p.merged, bot, user: p.user }); }
}
const count = (from, to, repos, withBots) => { const o = Object.fromEntries(MEASURES.map(m => [m, 0])); for (const e of events) if (e.d >= from && e.d < to && repos.has(e.repo) && (withBots || !e.bot)) o[e.m]++; return o; };

// ---------------------------------------------------------------- repository sets
const W25 = ['2025-01-01', '2025-10-07'], W26 = ['2026-01-01', '2026-10-07'];
const one = f => new Set([f]);
const perRepo = Object.fromEntries(REPOS.map(f => {
  const a = count(...W25, one(f), false), b = count(...W26, one(f), false);
  const first = [...raw.repos[f].issues.map(i => i.created), ...raw.repos[f].prs.map(p => p.created), ...raw.repos[f].releases.map(x => x.published).filter(Boolean)].sort()[0] || null;
  return [f, { created_at: raw.repos[f].meta.created_at, first_public_item: first, y2025: a, y2026: b }];
}));
const N = 5;   // merged pull requests (bots left out) in the 1 Jan to 6 Oct window
const SETS = {
  all_25: { label: 'All 25 public repositories', rule: 'Every public repository of the ecosystem (the earlier pass\'s list).', repos: REPOS },
  active_both_years: { label: 'Worked on in both years', rule: `At least ${N} pull requests merged (bots left out) between 1 January and 6 October in 2025 and again in 2026.`, repos: REPOS.filter(f => perRepo[f].y2025.prs_merged >= N && perRepo[f].y2026.prs_merged >= N) },
  without_new_in_2026: { label: 'Without repositories new in 2026', rule: 'Leaves out repositories with no issue, pull request or release before 1 January 2026.', repos: REPOS.filter(f => perRepo[f].first_public_item && perRepo[f].first_public_item < '2026-01-01') },
  active_in_2026: { label: 'Worked on in 2026 (chosen on the outcome; flatters 2026)', rule: `At least ${N} pull requests merged in the 2026 window, whatever happened in 2025.`, repos: REPOS.filter(f => perRepo[f].y2026.prs_merged >= N) },
  active_in_2025: { label: 'Worked on in 2025 (chosen on the baseline; flatters 2025)', rule: `At least ${N} pull requests merged in the 2025 window, whatever happened in 2026.`, repos: REPOS.filter(f => perRepo[f].y2025.prs_merged >= N) },
  pipeline_six: { label: 'The six pipeline packages', rule: 'gsm, gsm.core, gsm.mapping, gsm.kri, gsm.reporting, gsm.qtl (the earlier pass\'s cut).', repos: ['gsm', 'gsm.core', 'gsm.mapping', 'gsm.kri', 'gsm.reporting', 'gsm.qtl'].map(n => 'Gilead-Public/' + n) },
};
for (const s of Object.values(SETS)) { s.set = new Set(s.repos); s.dropped = REPOS.filter(f => !s.set.has(f)); }

// ---------------------------------------------------------------- 1. quarterly, by set, with and without bots
const QB = { '2025Q1': ['2025-01-01', '2025-04-01'], '2025Q2': ['2025-04-01', '2025-07-01'], '2025Q3': ['2025-07-01', '2025-10-01'], '2025Q4': ['2025-10-01', '2026-01-01'], '2026Q1': ['2026-01-01', '2026-04-01'], '2026Q2': ['2026-04-01', '2026-07-01'], '2026Q3': ['2026-07-01', '2026-10-01'] };
const WINDOWS = {
  Q1: [QB['2025Q1'], QB['2026Q1']], Q2: [QB['2025Q2'], QB['2026Q2']], Q3: [QB['2025Q3'], QB['2026Q3']],
  H1: [['2025-01-01', '2025-07-01'], ['2026-01-01', '2026-07-01']],
  Q2_Q3: [['2025-04-01', '2025-10-01'], ['2026-04-01', '2026-10-01']],
  Jan_Sep: [['2025-01-01', '2025-10-01'], ['2026-01-01', '2026-10-01']],
  Jan_1_to_Oct_6: [W25, W26],
};
const quarterly = {}, yoy = {};
for (const [sk, s] of Object.entries(SETS)) {
  quarterly[sk] = {}; yoy[sk] = {};
  for (const v of ['no_bots', 'with_bots']) {
    quarterly[sk][v] = Object.fromEntries(QUARTERS.map(q => [q, count(...QB[q], s.set, v === 'with_bots')]));
    yoy[sk][v] = Object.fromEntries(Object.entries(WINDOWS).map(([wk, [a, b]]) => { const x = count(...a, s.set, v === 'with_bots'), y = count(...b, s.set, v === 'with_bots'); return [wk, Object.fromEntries(MEASURES.map(m => [m, { y2025: x[m], y2026: y[m], change_pct: pct(x[m], y[m]) }]))]; }));
  }
}
// monthly, all 25, bots out (for the charts)
const monthly = Object.fromEntries(MONTHS.map(mo => { const [y, m] = mo.split('-').map(Number); const to = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`; return [mo, { all_25: count(mo + '-01', to, SETS.all_25.set, false), active_both_years: count(mo + '-01', to, SETS.active_both_years.set, false) }]; }));

// ---------------------------------------------------------------- 3. per person (accounts, never named)
const people = {};
const humanOpen = events.filter(e => (e.m === 'issues_opened' || e.m === 'prs_opened') && !e.bot && e.user);
const peopleFor = (from, to, set) => {
  const by = new Map(); let ghost = 0;
  for (const e of events) if ((e.m === 'issues_opened' || e.m === 'prs_opened') && !e.bot && e.d >= from && e.d < to && set.has(e.repo)) { if (!e.user) { ghost++; continue; } by.set(e.user, (by.get(e.user) || 0) + 1); }
  const counts = [...by.values()].sort((a, b) => b - a), total = counts.reduce((a, b) => a + b, 0);
  const merged = new Map(); for (const e of events) if (e.m === 'prs_merged' && !e.bot && e.user && e.d >= from && e.d < to && set.has(e.repo)) merged.set(e.user, (merged.get(e.user) || 0) + 1);
  const mTotal = [...merged.values()].reduce((a, b) => a + b, 0);
  return { accounts: by.size, items_opened: total, items_from_deleted_accounts: ghost, items_per_account: by.size ? r1(total / by.size) : null,
    accounts_with_10_or_more: counts.filter(c => c >= 10).length, items_per_account_10_or_more: r1(counts.filter(c => c >= 10).reduce((a, b) => a + b, 0) / (counts.filter(c => c >= 10).length || 1)),
    median_items_per_account: median(counts), top_account_share_pct: share(counts[0] || 0, total), top_3_accounts_share_pct: share(counts.slice(0, 3).reduce((a, b) => a + b, 0), total),
    accounts_merging_prs: merged.size, prs_merged: mTotal, prs_merged_per_merging_account: merged.size ? r1(mTotal / merged.size) : null, _set: new Set(by.keys()) };
};
for (const sk of ['all_25', 'active_both_years']) {
  people[sk] = { by_quarter: {}, windows: {} };
  for (const q of QUARTERS) people[sk].by_quarter[q] = peopleFor(...QB[q], SETS[sk].set);
  for (const [wk, [a, b]] of Object.entries(WINDOWS)) { const x = peopleFor(...a, SETS[sk].set), y = peopleFor(...b, SETS[sk].set); people[sk].windows[wk] = { y2025: x, y2026: y, accounts_in_both: [...x._set].filter(u => y._set.has(u)).length }; }
}
const strip = o => JSON.parse(JSON.stringify(o, (k, v) => k === '_set' ? undefined : v));

// ---------------------------------------------------------------- 4. direct evidence of AI use
// 4a commits
const commits = CM.commits.filter(c => c.author_date >= '2025-01-01' && c.author_date < CUT);
const fam = c => { const s = (c.ai_co.join(' ') + (c.ai_author ? ' ' + c.an + ' ' + c.ae : '')).toLowerCase(); return { copilot: /copilot/.test(s), claude: /claude|anthropic/.test(s), autofix: /autofix/.test(s) }; };
const aiCommit = c => c.ai_co.length > 0 || c.ai_author;
const agentCommit = c => aiCommit(c) && !c.suggestion;   // written with an agent, as opposed to a Copilot suggestion accepted in the browser
const commitRow = arr => { const human = arr.filter(c => !c.plain_bot); const ai = human.filter(aiCommit), ag = human.filter(agentCommit); return { commits: human.length, by_workflow_bots_left_out: arr.length - human.length, ai_marked: ai.length, ai_share_pct: share(ai.length, human.length), agent_written: ag.length, agent_written_share_pct: share(ag.length, human.length), copilot_suggestion_accepted: ai.length - ag.length, authors_with_agent_written: new Set(ag.map(c => c.ae.toLowerCase())).size, copilot: ai.filter(c => fam(c).copilot).length, claude: ai.filter(c => fam(c).claude).length, of_which_copilot_autofix: ai.filter(c => fam(c).autofix).length, authors: new Set(human.map(c => c.ae.toLowerCase())).size, authors_with_ai_marked: new Set(ai.map(c => c.ae.toLowerCase())).size }; };
const commitsByMonth = { all_refs: {}, default_branch: {} }, commitsByQuarter = { all_refs: {}, default_branch: {} };
for (const mo of MONTHS) { const a = commits.filter(c => c.author_date.slice(0, 7) === mo); commitsByMonth.all_refs[mo] = commitRow(a); commitsByMonth.default_branch[mo] = commitRow(a.filter(c => c.on_default)); }
for (const q of QUARTERS) { const a = commits.filter(c => qOf(c.author_date) === q); commitsByQuarter.all_refs[q] = commitRow(a); commitsByQuarter.default_branch[q] = commitRow(a.filter(c => c.on_default)); }
const firstAi = CM.commits.filter(aiCommit).filter(c => !c.plain_bot).map(c => c.author_date).sort();
const commitsByRepo2026 = Object.fromEntries(REPOS.map(f => [f, commitRow(commits.filter(c => c.repo === f && c.author_date >= '2026-01-01'))]).filter(([, v]) => v.commits > 0));
const coValues = {}; for (const c of commits) for (const v of c.ai_co) { const k = v.replace(/<.*>/, '').trim(); coValues[k] = (coValues[k] || 0) + 1; }

// 4b pull requests and issues
const aiSha = new Set(CM.commits.filter(agentCommit).map(c => c.sha));
const sugSha = new Set(CM.commits.filter(c => c.suggestion).map(c => c.sha));
const knownSha = new Set(CM.commits.map(c => c.sha));
const prRows = [], issueRows = [];
let prCommitsSeen = 0, prCommitsUnknown = 0;
for (const full of REPOS) {
  for (const p of raw.repos[full].prs) {
    if (p.created < '2025-01-01' || p.created >= CUT) continue;
    const shas = (PRC.prs[full] || {})[p.n] || [];
    for (const s of shas) { prCommitsSeen++; if (!knownSha.has(s)) prCommitsUnknown++; }
    prRows.push({ repo: full, d: p.created, merged: p.merged, bot: isBot(p), agent_account: AGENT_ACCOUNT.test(p.user || ''), user: p.user,
      attrib: ATTRIB.test(p.body), footer: TOOL_FOOTER.test(p.body), ai_word: AI_WORD.test(p.body),
      ai_commit: shas.some(s => aiSha.has(s)), suggestion_commit: shas.some(s => sugSha.has(s)), copilot_review: p.reviews.some(v => v.utype === 'Bot' && /copilot/i.test(v.user || '')),
      human_review: p.reviews.some(v => v.utype !== 'Bot' && v.user && v.user !== p.user),
      add: p.additions, del: p.deletions, files: p.files, commits: p.commits });
  }
  for (const i of raw.repos[full].issues) {
    if (i.created < '2025-01-01' || i.created >= CUT) continue;
    issueRows.push({ repo: full, d: i.created, closed: i.closed, bot: isBot(i), agent_account: AGENT_ACCOUNT.test(i.user || ''), attrib: ATTRIB.test(i.body), footer: TOOL_FOOTER.test(i.body), ai_word: AI_WORD.test(i.body) });
  }
}
const prEv = arr => { const h = arr.filter(p => !p.bot || p.agent_account); const any = h.filter(p => p.attrib || p.footer || p.ai_commit || p.suggestion_commit || p.copilot_review || p.agent_account); const wrote = h.filter(p => p.attrib || p.footer || p.ai_commit || p.agent_account);
  return { prs: h.length, opened_by_agent_account: h.filter(p => p.agent_account).length, attribution_line: h.filter(p => p.attrib).length, tool_footer: h.filter(p => p.footer).length, ai_coauthored_commit: h.filter(p => p.ai_commit).length, copilot_suggestion_accepted: h.filter(p => p.suggestion_commit).length, copilot_review: h.filter(p => p.copilot_review).length, names_an_ai_tool_in_body: h.filter(p => p.ai_word).length,
    ai_written_any: wrote.length, ai_written_share_pct: share(wrote.length, h.length), ai_any_incl_review: any.length, ai_any_incl_review_share_pct: share(any.length, h.length),
    authors: new Set(h.map(p => p.user).filter(Boolean)).size, authors_with_ai_written: new Set(wrote.map(p => p.user).filter(Boolean)).size }; };
const isEv = arr => { const h = arr.filter(i => !i.bot); return { issues: h.length, attribution_line: h.filter(i => i.attrib).length, tool_footer: h.filter(i => i.footer).length, names_an_ai_tool_in_body: h.filter(i => i.ai_word).length, attribution_share_pct: share(h.filter(i => i.attrib || i.footer).length, h.length) }; };
const prByMonth = Object.fromEntries(MONTHS.map(mo => [mo, prEv(prRows.filter(p => p.d.slice(0, 7) === mo))]));
const prByQuarter = Object.fromEntries(QUARTERS.map(q => [q, prEv(prRows.filter(p => qOf(p.d) === q))]));
const prByQuarterBoth = Object.fromEntries(QUARTERS.map(q => [q, prEv(prRows.filter(p => qOf(p.d) === q && SETS.active_both_years.set.has(p.repo)))]));
const issueByMonth = Object.fromEntries(MONTHS.map(mo => [mo, isEv(issueRows.filter(i => i.d.slice(0, 7) === mo))]));
const issueByQuarter = Object.fromEntries(QUARTERS.map(q => [q, isEv(issueRows.filter(i => qOf(i.d) === q))]));
const prEvByRepo2026 = Object.fromEntries(REPOS.map(f => [f, prEv(prRows.filter(p => p.repo === f && p.d >= '2026-01-01'))]).filter(([, v]) => v.prs > 0));

// how the marked pull requests spread over accounts (no names): April to September 2026
const conc = (() => { const h = prRows.filter(p => !p.bot && p.d >= '2026-04-01' && p.d < '2026-10-01' && p.user); const by = new Map(), all = new Map(); for (const p of h) { all.set(p.user, (all.get(p.user) || 0) + 1); if (p.attrib || p.footer || p.ai_commit) by.set(p.user, (by.get(p.user) || 0) + 1); } const c = [...by.values()].sort((x, y) => y - x), t = c.reduce((x, y) => x + y, 0); const shares = [...all.entries()].map(([u, n]) => (by.get(u) || 0) / n).sort((x, y) => y - x);
  return { window: 'April to September 2026', accounts_opening_prs: all.size, accounts_with_a_marked_pr: by.size, accounts_with_5_or_more_marked: c.filter(v => v >= 5).length, marked_prs: t, top_account_share_of_marked_pct: share(c[0] || 0, t), top_3_accounts_share_of_marked_pct: share(c.slice(0, 3).reduce((x, y) => x + y, 0), t), accounts_with_10_or_more_prs: [...all.values()].filter(v => v >= 10).length, marked_share_of_own_prs_among_accounts_with_10_or_more_pct: (v => ({ lowest: v[0], median: median(v), highest: v[v.length - 1] }))([...all.entries()].filter(([, n]) => n >= 10).map(([u, n]) => Math.round((by.get(u) || 0) / n * 100)).sort((x, y) => x - y)) }; })();

// which tool the attribution line names (tools, not people)
const toolOf = b => { const m = b.match(/\bdrafted by\b([^\n]{0,60})/i); if (!m) return null; const s = m[1].toLowerCase(); return /claude code/.test(s) ? 'Claude Code' : /copilot/.test(s) ? 'GitHub Copilot' : /posit assistant/.test(s) ? 'Posit Assistant' : 'other'; };
const attributionTools = {};
for (const full of REPOS) for (const x of [...raw.repos[full].issues, ...raw.repos[full].prs]) { if (x.created < '2025-01-01' || x.created >= CUT || isBot(x) || !ATTRIB.test(x.body)) continue; const t = toolOf(x.body), q = qOf(x.created); attributionTools[t] ??= {}; attributionTools[t][q] = (attributionTools[t][q] || 0) + 1; }

// 4c comments
const comments = [];
for (const full of REPOS) for (const kind of ['issue_comments', 'review_comments']) for (const c of raw.repos[full][kind]) if (c.created >= '2025-01-01' && c.created < CUT) comments.push({ repo: full, kind, d: c.created, bot: c.utype === 'Bot', copilot: c.utype === 'Bot' && /copilot/i.test(c.user || ''), attrib: ATTRIB.test(c.body) });
const cmEv = arr => ({ review_comments_by_people: arr.filter(c => c.kind === 'review_comments' && !c.bot).length, review_comments_by_copilot: arr.filter(c => c.kind === 'review_comments' && c.copilot).length, issue_and_pr_comments_by_people: arr.filter(c => c.kind === 'issue_comments' && !c.bot).length, comments: arr.length, by_people: arr.filter(c => !c.bot).length, by_people_with_attribution_line: arr.filter(c => !c.bot && c.attrib).length, by_copilot: arr.filter(c => c.copilot).length, by_other_bots: arr.filter(c => c.bot && !c.copilot).length, attribution_share_of_people_pct: share(arr.filter(c => !c.bot && c.attrib).length, arr.filter(c => !c.bot).length) });
const commentsByQuarter = Object.fromEntries(QUARTERS.map(q => [q, cmEv(comments.filter(c => qOf(c.d) === q))]));
const commentsByMonth = Object.fromEntries(MONTHS.map(mo => [mo, cmEv(comments.filter(c => c.d.slice(0, 7) === mo))]));

// ---------------------------------------------------------------- 5. shape of the work
const shape = {};
for (const q of QUARTERS) {
  const merged = []; const sizes = []; const files = [];
  for (const full of REPOS) for (const p of raw.repos[full].prs) if (p.merged && !isBot(p) && qOf(p.merged) === q && p.merged < CUT) { merged.push((new Date(p.merged) - new Date(p.created)) / 36e5); sizes.push(p.additions + p.deletions); files.push(p.files); }
  const [qa, qb] = QB[q]; const lim = new Date(new Date(CUT) - 30 * 864e5).toISOString();
  const cohort = []; for (const full of REPOS) for (const i of raw.repos[full].issues) if (!isBot(i) && i.created >= qa && i.created < qb && i.created < lim) cohort.push(i);
  const in30 = cohort.filter(i => i.closed && (new Date(i.closed) - new Date(i.created)) <= 30 * 864e5).length;
  shape[q] = { prs_merged: merged.length, median_hours_open_to_merge: r1(median(merged)), share_merged_within_24h_pct: share(merged.filter(h => h <= 24).length, merged.length), median_lines_changed: median(sizes), median_files_changed: median(files),
    merged_prs_reviewed_by_another_person_pct: (() => { let n = 0, h = 0; for (const full of REPOS) for (const p of raw.repos[full].prs) if (p.merged && !isBot(p) && qOf(p.merged) === q && p.merged < CUT) { n++; if (p.reviews.some(v => v.utype !== 'Bot' && v.user && v.user !== p.user)) h++; } return share(h, n); })(),
    issues_opened_with_30_days_to_follow: cohort.length, closed_within_30_days: in30, closed_within_30_days_pct: share(in30, cohort.length),
  };
}

// tests: a merged pull request "touches a test" when one of its commits adds or changes a test file
const testSha = new Set(TESTS.rows.map(r => r.sha)), testAddSha = new Set(TESTS.rows.filter(r => r.test_files_added > 0).map(r => r.sha));
const testRow = (from, to, set) => { let n = 0, t = 0, ad = 0, nolist = 0;
  for (const full of REPOS) if (set.has(full)) for (const p of raw.repos[full].prs) { if (isBot(p) || !p.merged || p.merged < from || p.merged >= to) continue; const sh = (PRC.prs[full] || {})[p.n]; if (!sh) { nolist++; continue; } n++; if (sh.some(s => testSha.has(s))) t++; if (sh.some(s => testAddSha.has(s))) ad++; }
  return { prs_merged_with_commit_list: n, without_commit_list: nolist, touch_a_test_file: t, touch_a_test_file_pct: share(t, n), add_a_new_test_file: ad, add_a_new_test_file_pct: share(ad, n) }; };
const tests = {};
for (const sk of ['all_25', 'active_both_years', 'without_new_in_2026']) { tests[sk] = { by_quarter: Object.fromEntries(QUARTERS.map(q => [q, testRow(...QB[q], SETS[sk].set)])), windows: Object.fromEntries(Object.entries(WINDOWS).map(([wk, [x, y]]) => [wk, { y2025: testRow(...x, SETS[sk].set), y2026: testRow(...y, SETS[sk].set) }])) }; }

// context: every quarter since 2022, all 25 repositories, bots left out
const history = {}; for (let y = 2022; y <= 2026; y++) for (let k = 1; k <= 4; k++) { const from = `${y}-${String(k * 3 - 2).padStart(2, '0')}-01`, to = k === 4 ? `${y + 1}-01-01` : `${y}-${String(k * 3 + 1).padStart(2, '0')}-01`; if (from < '2026-10-01') history[`${y}Q${k}`] = count(from, to, SETS.all_25.set, false); }
const perRepoQuarterly = Object.fromEntries(REPOS.map(f => [f, Object.fromEntries(QUARTERS.map(q => [q, count(...QB[q], one(f), false)]))]));

// ---------------------------------------------------------------- write
const data = {
  about: 'Does public GitHub history show a change since the gsm / OpenRBQM team adopted AI coding agents? Counted for the R/Pharma 2026 keynote. Draft; aggregate only, no account names.',
  fetched_utc: { issues_prs_releases_comments: [raw.started, raw.finished], retries: raw.retries || [], pr_commit_lists: [PRC.started, PRC.finished], commits_read_from_clones: CM.made, test_files: TESTS.made },
  cut_off: 'Nothing on or after 2026-10-07T00:00:00Z is counted. Quarters are calendar quarters in UTC; 2026 Q3 (July to September) is the last whole one.',
  definitions: {
    issues_opened: 'issues (not pull requests) by created date', issues_closed: 'issues by closed date, whatever the reason', prs_opened: 'pull requests by created date', prs_merged: 'pull requests by merged date',
    releases: 'published GitHub releases whose tag looks like a version (v1.2.3), by published date, whoever published them',
    bot: 'the account that opened the item is of type Bot (dependabot, github-actions, cm-operations-bot, ci-gh-app). "no_bots" leaves these out; "with_bots" keeps them.',
    coding_agent_account: 'a Bot account belonging to a coding agent (Copilot coding agent, Claude, Codex, Devin, Jules, Cursor). Counted separately from other bots.',
    agent_written_commit: 'an AI-marked commit that is not a Copilot suggestion accepted in the browser (GitHub as committer and a subject GitHub writes: "Update <file>", "Apply suggestions from code review", "Potential fix for ...")',
    ai_marked_commit: 'a non-merge commit whose message has a Co-authored-by trailer naming Claude or Copilot (or another AI tool), or whose author is one. Commits are read from every branch, tag and pull request head and counted once per hash; commits by workflow and dependency bots are left out of both the count and the base.',
    attribution_line: 'the body has "drafted by" followed within 40 characters by the name of an AI tool (Claude, Copilot, Posit Assistant, Codex, GPT, Cursor, Gemini, assistant, agent). The team convention is "This PR was drafted by <agent> using <model> and reviewed by <person>".',
    ai_written_pr: 'a pull request with an attribution line or tool footer in its body, or at least one agent-written commit, or opened by a coding-agent account. A pull request whose only mark is an accepted Copilot suggestion or a Copilot review is not counted here; it is counted in ai_any_incl_review.',
    copilot_review: 'a review on the pull request submitted by a Copilot bot account',
    test_file: 'tests/testthat/test-*.R, or *.test.js / *.spec.js / a .js file under tests/ or __tests__/. A merged pull request touches a test when one of its commits (as GitHub lists them) adds or changes such a file.',
    repo_sets: Object.fromEntries(Object.entries(SETS).map(([k, s]) => [k, { label: s.label, rule: s.rule, repos: s.repos, dropped: s.dropped }])),
  },
  per_repo_jan1_oct6: perRepo,
  quarterly, year_over_year: yoy, monthly_no_bots: monthly,
  contributors: strip(people),
  ai_evidence: { first_ai_marked_commit_utc: firstAi[0] || null, ai_coauthor_names_2025_onward: coValues, commits_by_month: commitsByMonth, commits_by_quarter: commitsByQuarter, commits_by_repo_2026: commitsByRepo2026,
    pr_commits_matched_to_clones: { listed: prCommitsSeen, not_found_in_clones: prCommitsUnknown },
    prs_by_month: prByMonth, prs_by_quarter: prByQuarter, prs_by_quarter_active_both_years: prByQuarterBoth, prs_by_repo_2026: prEvByRepo2026, attribution_line_names_tool_by_quarter: attributionTools, marked_prs_across_accounts: conc, issues_by_month: issueByMonth, issues_by_quarter: issueByQuarter, comments_by_month: commentsByMonth, comments_by_quarter: commentsByQuarter },
  cross_checks: {
    search_api_quarterly: fs.existsSync(dir + 'crosscheck.json') ? (x => ({ ran_utc: [x.started, x.finished], figures_compared: x.rows.length, mismatches: x.mismatches, how: 'GitHub search API total_count, no login, one query per measure, quarter and variant; every query is in crosscheck.json' }))(JSON.parse(fs.readFileSync(dir + 'crosscheck.json', 'utf8'))) : 'not run (run ai-adoption-crosscheck.mjs after this script)',
    search_api_ai_marks: fs.existsSync(dir + 'crosscheck-ai.json') ? JSON.parse(fs.readFileSync(dir + 'crosscheck-ai.json', 'utf8')) : 'not run',
    git_grep_ai_trailers: CM.second_count,
    workflow_bot_commits_with_ai_trailer_left_out: commits.filter(c => c.plain_bot && c.ai_co.length > 0).length,
  },
  shape_by_quarter: shape, tests_in_merged_prs: tests, history_all_25_no_bots: history, per_repo_quarterly_no_bots: perRepoQuarterly,
};
fs.writeFileSync(OUT, JSON.stringify(data, null, 1));

// ---------------------------------------------------------------- print
const P = (...a) => console.log(...a);
const sgn = p => p === null ? 'n/a' : (p > 0 ? '+' : p < 0 ? '-' : '') + Math.round(Math.abs(p)) + '%';   // halves round away from zero
P('fetched', JSON.stringify(data.fetched_utc));
for (const [sk, s] of Object.entries(SETS)) {
  P(`\n=== ${s.label} (${s.repos.length} repos) — ${s.rule}`);
  P('   in: ' + s.repos.map(f => f.split('/')[1]).join(', '));
  P('   dropped: ' + s.dropped.map(f => f.split('/')[1]).join(', '));
  for (const v of ['no_bots', 'with_bots']) {
    P(`  [${v}] quarter      iO   iC   pO   pM  rel`);
    for (const q of QUARTERS) { const c = quarterly[sk][v][q]; P('   ' + q.padEnd(14) + MEASURES.map(m => String(c[m]).padStart(5)).join('')); }
    for (const wk of Object.keys(WINDOWS)) { const w = yoy[sk][v][wk]; P('   ' + (wk + ' yoy').padEnd(20) + MEASURES.map(m => `${m.replace('issues_', 'i').replace('prs_', 'p').replace('releases', 'rel')} ${w[m].y2025}->${w[m].y2026} (${sgn(w[m].change_pct)})`).join(' | ')); }
  }
}
P('\n=== per repo, 1 Jan to 6 Oct, bots out: prs merged 2025 -> 2026 | first public item');
for (const f of REPOS) P('   ' + f.padEnd(34) + String(perRepo[f].y2025.prs_merged).padStart(4) + ' -> ' + String(perRepo[f].y2026.prs_merged).padEnd(4) + (perRepo[f].first_public_item || '').slice(0, 10) + '  created ' + perRepo[f].created_at.slice(0, 10));
for (const sk of ['all_25', 'active_both_years']) {
  P(`\n=== contributors, ${sk}: quarter accounts items items/acct accts>=10 items/acct>=10 median top1% top3% | mergers prsMerged perMerger`);
  for (const q of QUARTERS) { const x = people[sk].by_quarter[q]; P('   ' + q, x.accounts, x.items_opened, x.items_per_account, x.accounts_with_10_or_more, x.items_per_account_10_or_more, x.median_items_per_account, x.top_account_share_pct, x.top_3_accounts_share_pct, '|', x.accounts_merging_prs, x.prs_merged, x.prs_merged_per_merging_account); }
  for (const wk of Object.keys(WINDOWS)) { const w = people[sk].windows[wk]; P('   ' + wk, `accounts ${w.y2025.accounts}->${w.y2026.accounts} (both ${w.accounts_in_both}) items/acct ${w.y2025.items_per_account}->${w.y2026.items_per_account} | >=10: ${w.y2025.accounts_with_10_or_more}->${w.y2026.accounts_with_10_or_more}, ${w.y2025.items_per_account_10_or_more}->${w.y2026.items_per_account_10_or_more} | top1 ${w.y2025.top_account_share_pct}%->${w.y2026.top_account_share_pct}% | merged/merger ${w.y2025.prs_merged_per_merging_account}->${w.y2026.prs_merged_per_merging_account} (${w.y2025.accounts_merging_prs}->${w.y2026.accounts_merging_prs})`); }
}
P('\n=== AI-marked commits by month (all refs | default branch): commits ai share% copilot claude autofix authors authorsAI');
for (const mo of MONTHS) { const a = commitsByMonth.all_refs[mo], b = commitsByMonth.default_branch[mo]; P('   ' + mo, a.commits, a.ai_marked, a.ai_share_pct + '%', 'agent', a.agent_written, a.agent_written_share_pct + '%', 'sugg', a.copilot_suggestion_accepted, 'cop', a.copilot, 'cl', a.claude, 'authors', a.authors, a.authors_with_agent_written, '|', b.commits, b.agent_written, b.agent_written_share_pct + '%'); }
for (const q of QUARTERS) { const a = commitsByQuarter.all_refs[q], b = commitsByQuarter.default_branch[q]; P('   ' + q, a.commits, a.ai_marked, a.ai_share_pct + '%', 'agent', a.agent_written, a.agent_written_share_pct + '%', 'sugg', a.copilot_suggestion_accepted, 'cop', a.copilot, 'cl', a.claude, 'authors', a.authors, a.authors_with_agent_written, '|', b.commits, b.agent_written, b.agent_written_share_pct + '%'); }
P('   first AI-marked commit', firstAi[0], '| co-author names', JSON.stringify(coValues));
P('   by repo 2026:'); for (const [f, v] of Object.entries(commitsByRepo2026)) P('     ' + f.padEnd(34), v.commits, v.agent_written, v.agent_written_share_pct + '%');
P('   pr commits listed', prCommitsSeen, 'not in clones', prCommitsUnknown);
P('\n=== PR evidence by month: prs agentAcct attrib footer aiCommit copilotReview namesAI | written% any% | authors authorsAI');
const prLine = (k, x) => P('   ' + k, x.prs, x.opened_by_agent_account, x.attribution_line, x.tool_footer, x.ai_coauthored_commit, 'sugg', x.copilot_suggestion_accepted, 'rev', x.copilot_review, x.names_an_ai_tool_in_body, '|', x.ai_written_any, x.ai_written_share_pct + '%', x.ai_any_incl_review, x.ai_any_incl_review_share_pct + '%', '|', x.authors, x.authors_with_ai_written);
for (const mo of MONTHS) prLine(mo, prByMonth[mo]);
for (const q of QUARTERS) prLine(q, prByQuarter[q]);
P('   active_both_years:'); for (const q of QUARTERS) prLine(q, prByQuarterBoth[q]);
P('   by repo 2026:'); for (const [f, v] of Object.entries(prEvByRepo2026)) prLine(f.padEnd(34), v);
P('\n=== issue evidence: issues attrib footer namesAI share%');
for (const mo of MONTHS) { const x = issueByMonth[mo]; P('   ' + mo, x.issues, x.attribution_line, x.tool_footer, x.names_an_ai_tool_in_body, x.attribution_share_pct + '%'); }
for (const q of QUARTERS) { const x = issueByQuarter[q]; P('   ' + q, x.issues, x.attribution_line, x.tool_footer, x.names_an_ai_tool_in_body, x.attribution_share_pct + '%'); }
P('\n=== comments by quarter: all byPeople withAttrib byCopilot otherBots share%');
for (const q of QUARTERS) { const x = commentsByQuarter[q]; P('   ' + q, x.comments, x.by_people, x.by_people_with_attribution_line, x.by_copilot, x.by_other_bots, x.attribution_share_of_people_pct + '%'); }
P('\n=== shape by quarter');
for (const q of QUARTERS) P('   ' + q, JSON.stringify(shape[q]));

P('\n=== merged PRs that touch a test file / add a new one');
for (const sk of Object.keys(tests)) { P('  ' + sk); for (const q of QUARTERS) { const x = tests[sk].by_quarter[q]; P('   ' + q, x.prs_merged_with_commit_list, x.touch_a_test_file, x.touch_a_test_file_pct + '%', x.add_a_new_test_file, x.add_a_new_test_file_pct + '%', 'no list', x.without_commit_list); }
  for (const wk of Object.keys(WINDOWS)) { const w = tests[sk].windows[wk]; P('   ' + wk, `touch ${w.y2025.touch_a_test_file}/${w.y2025.prs_merged_with_commit_list} (${w.y2025.touch_a_test_file_pct}%) -> ${w.y2026.touch_a_test_file}/${w.y2026.prs_merged_with_commit_list} (${w.y2026.touch_a_test_file_pct}%) | add ${w.y2025.add_a_new_test_file_pct}% -> ${w.y2026.add_a_new_test_file_pct}%`); } }
P('\n=== history, all 25, bots out: quarter iO iC pO pM rel');
for (const [q, c] of Object.entries(history)) P('   ' + q + MEASURES.map(m => String(c[m]).padStart(5)).join(''));
for (const m of MEASURES) { const best = Object.entries(history).sort((x, y) => y[1][m] - x[1][m]).slice(0, 3).map(([q, c]) => q + ' ' + c[m]); P('   top 3 quarters for ' + m + ': ' + best.join(', ')); }

P('\n=== attribution line names which tool, by quarter'); P('   ' + JSON.stringify(attributionTools));
P('\n=== comments by quarter: people review | copilot review | people issue+pr comments');
for (const q of QUARTERS) { const x = commentsByQuarter[q]; P('   ' + q, x.review_comments_by_people, x.review_comments_by_copilot, x.issue_and_pr_comments_by_people); }
P('\n=== compact: set x window, change 2025 -> 2026, bots out: prs opened | prs merged | issues opened | issues closed | releases');
for (const [sk, s] of Object.entries(SETS)) for (const wk of ['Q1', 'Q2', 'Q3', 'Q2_Q3', 'Jan_Sep']) { const w = yoy[sk].no_bots[wk]; P('   ' + (sk + ' ' + wk).padEnd(30) + ['prs_opened', 'prs_merged', 'issues_opened', 'issues_closed', 'releases'].map(m => `${w[m].y2025}→${w[m].y2026} (${sgn(w[m].change_pct)})`.padEnd(18)).join('')); }
P('\n=== marked PRs across accounts', JSON.stringify(conc));
