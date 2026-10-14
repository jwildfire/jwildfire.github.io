// Aggregate raw.json into monthly counts per repo and the year-over-year comparisons.
// Dates are UTC. Windows are half-open [from, to).
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const raw = JSON.parse(fs.readFileSync(dir + 'raw.json', 'utf8'));
const OUT = process.argv[2] || (dir + 'slide25-activity-data.json');

// ---- scope ---------------------------------------------------------------
const EXCLUDE = {
  'Gilead-Public/Open-SMART-PMI': 'not part of the gsm ecosystem (a Python project of another group)',
  'Gilead-Public/CLAIRE': 'not part of the gsm ecosystem (a C# project of another group)',
  'Gilead-Public/.github': 'organisation profile repo; no issues, pull requests or releases',
  'Gilead-Public/biostats-gsm': 'empty repo; no issues, pull requests or releases',
  'Gilead-Public/test123': 'empty test repo; no issues, pull requests or releases',
  'Gilead-BioStats/gsm.core': 'redirect stub created 2026-09-21; the package and its history are counted at Gilead-Public/gsm.core',
  'Gilead-BioStats/gsm.mapping': 'redirect stub created 2026-09-21; counted at Gilead-Public/gsm.mapping',
  'Gilead-BioStats/gsm.kri': 'redirect stub created 2026-09-21; counted at Gilead-Public/gsm.kri',
  'Gilead-BioStats/gsm.reporting': 'redirect stub created 2026-09-21; counted at Gilead-Public/gsm.reporting',
  'OpenRBQM/cluster': 'empty repo; no issues, pull requests or releases',
  'OpenRBQM/gsm.query': 'empty repo; no issues, pull requests or releases',
  'OpenRBQM/openRBQM-workshop-EU25': 'a fork; its 3 pull requests are all before 2026 and outside both windows',
};
const included = Object.keys(raw.repos).filter(k => !EXCLUDE[k]);

// ---- classification ------------------------------------------------------
const isBot = x => x.utype === 'Bot' || /\[bot\]$/.test(x.user || '');
const isVersionTag = t => /^v?\d+\.\d+/.test(t);          // v1.2.3 ; everything else is a build or test tag
const MEASURES = ['releases', 'issues_opened', 'issues_closed', 'prs_opened', 'prs_merged'];

// events: {repo, measure, date, bot, versioned}
const events = [];
for (const full of included) {
  const r = raw.repos[full];
  for (const x of r.releases) if (!x.draft && x.published) events.push({ repo: full, m: 'releases', d: x.published, bot: isBot(x), versioned: isVersionTag(x.tag), pre: x.prerelease, tag: x.tag });
  for (const i of r.issues) {
    const bot = isBot(i);
    if (i.pr) {
      events.push({ repo: full, m: 'prs_opened', d: i.created, bot });
      if (i.merged) events.push({ repo: full, m: 'prs_merged', d: i.merged, bot });
    } else {
      events.push({ repo: full, m: 'issues_opened', d: i.created, bot });
      if (i.closed) events.push({ repo: full, m: 'issues_closed', d: i.closed, bot });
    }
  }
}

// "main" definition: releases = versioned tags only (any author); issues and PRs = all authors.
const variants = {
  all: e => true,
  no_bots: e => !e.bot,
  main: e => e.m === 'releases' ? e.versioned : true,
  main_no_bots: e => (e.m === 'releases' ? e.versioned : true) && !e.bot,
  slide: e => e.m === 'releases' ? e.versioned : !e.bot,
};
const count = (from, to, filt, repoFilt = () => true) => {
  const o = Object.fromEntries(MEASURES.map(m => [m, 0]));
  for (const e of events) if (e.d >= from && e.d < to && filt(e) && repoFilt(e.repo)) o[e.m]++;
  return o;
};
const pct = (a, b) => a === 0 ? null : Math.round((b / a - 1) * 1000) / 10;
const compare = (label, w25, w26, repoFilt) => {
  const out = { label, window_earlier: { from: w25[0], to_exclusive: w25[1] }, window_later: { from: w26[0], to_exclusive: w26[1] }, variants: {} };
  for (const [vn, vf] of Object.entries(variants)) {
    const a = count(w25[0], w25[1], vf, repoFilt), b = count(w26[0], w26[1], vf, repoFilt);
    out.variants[vn] = Object.fromEntries(MEASURES.map(m => [m, { earlier: a[m], later: b[m], change_pct: pct(a[m], b[m]), ratio: a[m] ? Math.round(b[m] / a[m] * 100) / 100 : null }]));
  }
  return out;
};

// ---- monthly -------------------------------------------------------------
const months = [];
for (let y = 2025; y <= 2026; y++) for (let m = 1; m <= 12; m++) { const k = `${y}-${String(m).padStart(2, '0')}`; if (k <= '2026-10') months.push(k); }
const monthly = {};           // repo -> month -> measure -> {all, bots, releases_versioned}
for (const full of included) {
  monthly[full] = {};
  for (const mo of months) monthly[full][mo] = { releases: 0, releases_versioned: 0, releases_by_bots: 0, issues_opened: 0, issues_opened_by_bots: 0, issues_closed: 0, issues_closed_by_bots: 0, prs_opened: 0, prs_opened_by_bots: 0, prs_merged: 0, prs_merged_by_bots: 0 };
}
const CUT = '2026-10-07';     // nothing on or after 7 October 2026 (UTC) is counted
for (const e of events) {
  if (e.d < '2025-01-01' || e.d >= CUT) continue;
  const c = monthly[e.repo][e.d.slice(0, 7)];
  c[e.m]++;
  if (e.bot) c[e.m + '_by_bots']++;
  if (e.m === 'releases' && e.versioned) c.releases_versioned++;
}
const totalMonthly = {};
for (const mo of months) {
  totalMonthly[mo] = {};
  for (const full of included) for (const [k, v] of Object.entries(monthly[full][mo])) totalMonthly[mo][k] = (totalMonthly[mo][k] || 0) + v;
}

// ---- comparisons ---------------------------------------------------------
const existedBefore2025 = full => raw.repos[full].meta.created_at < '2025-01-01';
const comparisons = {
  ytd: compare('1 January to 6 October, 2026 against 2025', ['2025-01-01', '2025-10-07'], ['2026-01-01', '2026-10-07']),
  blog_jan_to_9_jun: compare('1 January to 9 June (the day before the post), 2026 against 2025', ['2025-01-01', '2025-06-10'], ['2026-01-01', '2026-06-10']),
  blog_jan_to_may: compare('January to May, whole months, 2026 against 2025', ['2025-01-01', '2025-06-01'], ['2026-01-01', '2026-06-01']),
  blog_trailing_12m: compare('12 months to 9 June 2026 against the 12 months before', ['2024-06-10', '2025-06-10'], ['2025-06-10', '2026-06-10']),
  trailing_12m_to_6_oct: compare('12 months to 6 October 2026 against the 12 months before', ['2024-10-07', '2025-10-07'], ['2025-10-07', '2026-10-07']),
  full_year_2024_vs_2025: compare('Whole years, for context: 2025 against 2024', ['2024-01-01', '2025-01-01'], ['2025-01-01', '2026-01-01']),
  since_post: compare('10 June to 6 October, 2026 against 2025', ['2025-06-10', '2025-10-07'], ['2026-06-10', '2026-10-07']),
  ytd_without_qcthat: compare('YTD, leaving out qcthat', ['2025-01-01', '2025-10-07'], ['2026-01-01', '2026-10-07'], r => r !== 'Gilead-Public/qcthat'),
  ytd_without_gsm_app: compare('YTD, leaving out gsm.app', ['2025-01-01', '2025-10-07'], ['2026-01-01', '2026-10-07'], r => r !== 'Gilead-BioStats/gsm.app'),
  ytd_pipeline_packages: compare('YTD, the six pipeline packages only (gsm, gsm.core, gsm.mapping, gsm.kri, gsm.reporting, gsm.qtl)', ['2025-01-01', '2025-10-07'], ['2026-01-01', '2026-10-07'],
    r => ['Gilead-Public/gsm', 'Gilead-Public/gsm.core', 'Gilead-Public/gsm.mapping', 'Gilead-Public/gsm.kri', 'Gilead-Public/gsm.reporting', 'Gilead-Public/gsm.qtl'].includes(r)),
  blog_jan_to_9_jun_without_gsm_app: compare('1 January to 9 June, leaving out gsm.app', ['2025-01-01', '2025-06-10'], ['2026-01-01', '2026-06-10'], r => r !== 'Gilead-BioStats/gsm.app'),
};

// per-repo YTD (main variant)
const perRepo = v => { const o = {}; for (const full of included) {
  const a = count('2025-01-01', '2025-10-07', variants[v], r => r === full), b = count('2026-01-01', '2026-10-07', variants[v], r => r === full);
  o[full] = Object.fromEntries(MEASURES.map(m => [m, { y2025: a[m], y2026: b[m] }]));
} return o; };
const perRepoYtd = perRepo('main'), perRepoYtdSlide = perRepo('slide');

// bot authors
const botAuthors = {};
for (const full of included) for (const i of raw.repos[full].issues) if (isBot(i) && i.created >= '2025-01-01' && i.created < CUT) {
  botAuthors[i.user] ??= { issues_2025: 0, issues_2026: 0, prs_2025: 0, prs_2026: 0 };
  botAuthors[i.user][(i.pr ? 'prs_' : 'issues_') + i.created.slice(0, 4)]++;
}
const oddTags = events.filter(e => e.m === 'releases' && !e.versioned && e.d >= '2025-01-01' && e.d < CUT).map(e => ({ repo: e.repo, tag: e.tag, published: e.d, by_bot: e.bot }));

const data = {
  about: 'Public GitHub activity of the gsm / OpenRBQM ecosystem, counted for slide 25 of the R/Pharma 2026 keynote. Draft.',
  fetched_utc: { started: raw.started, finished: raw.finished },
  cross_checked_utc: 'Totals for both variants re-counted with the unauthenticated search API at 2026-10-07T11:46Z (every author) and 11:52Z (bots removed); all 16 figures matched.',
  cut_off: 'Events on or after 2026-10-07T00:00:00Z are not counted. October 2026 in "monthly" is 1 to 6 October only.',
  timezone: 'UTC',
  definitions: {
    releases: 'GitHub releases by published_at. "releases" is every published release; "releases_versioned" keeps tags that look like a version (v1.2.3) and drops build and test tags such as "61/merge", "main", "ForTesting". Drafts are not visible to the public API.',
    issues_opened: 'issues (not pull requests) by created_at', issues_closed: 'issues (not pull requests) by closed_at, whatever the reason',
    prs_opened: 'pull requests by created_at', prs_merged: 'pull requests by merged_at',
    by_bots: 'author account is of type Bot (dependabot[bot], github-actions[bot], cm-operations-bot[bot], ci-gh-app[bot])',
    comparisons: 'each comparison has an earlier and a later window, half-open [from, to_exclusive), and four variants; change_pct = later / earlier - 1',
    variants: { all: 'everything', no_bots: 'bot-authored items removed', main: 'versioned releases only; issues and pull requests from every author', main_no_bots: 'main, with bot-authored items removed (this also drops versioned releases that a workflow published)', slide: 'the figures on the draft slide: versioned releases whoever published them; issues and pull requests with bot-authored ones removed' },
  },
  repos_included: included.map(f => ({ repo: f, created_at: raw.repos[f].meta.created_at, pushed_at: raw.repos[f].meta.pushed_at, issues_and_prs_all_time: raw.repos[f].issues.length, releases_all_time: raw.repos[f].releases.length })),
  repos_excluded_public: EXCLUDE,
  comparisons, per_repo_ytd_slide: perRepoYtdSlide, per_repo_ytd_main: perRepoYtd, bot_authors_2025_onward: botAuthors, release_tags_not_counted_as_versions: oddTags,
  monthly_total: totalMonthly, monthly_by_repo: monthly,
};
fs.writeFileSync(OUT, JSON.stringify(data, null, 1));

// ---- print ---------------------------------------------------------------
const show = c => { console.log('\n== ' + c.label); for (const vn of Object.keys(variants)) console.log('  ' + vn.padEnd(13) + MEASURES.map(m => { const x = c.variants[vn][m]; return `${m} ${x.earlier}->${x.later} (${x.change_pct === null ? 'n/a' : (x.change_pct > 0 ? '+' : '') + x.change_pct + '%'})`; }).join(' | ')); };
Object.values(comparisons).forEach(show);
console.log('\nMONTHLY TOTAL (main: versioned releases)');
console.log('month    rel relV  iO  iC  pO  pM | bots: iO pO pM rel');
for (const mo of months) { const t = totalMonthly[mo]; console.log(mo, String(t.releases).padStart(4), String(t.releases_versioned).padStart(4), String(t.issues_opened).padStart(4), String(t.issues_closed).padStart(3), String(t.prs_opened).padStart(3), String(t.prs_merged).padStart(3), ' |', t.issues_opened_by_bots, t.prs_opened_by_bots, t.prs_merged_by_bots, t.releases_by_bots); }
console.log('bots', botAuthors);
console.log('odd tags', oddTags.length, oddTags.map(o => o.repo.split('/')[1] + ':' + o.tag).join(', '));
console.log('included', included.length, included.join(', '));
