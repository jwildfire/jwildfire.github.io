// Build slide25-activity.html: the deck's own <head> (CSS) and script, around two draft sections whose
// numbers and geometry are computed from slide25-activity-data.json.
import fs from 'node:fs';
const KEY = '/Users/jwildfire/Documents/github/jwildfire.github.io/.claude/worktrees/keynote-deck/keynote/';
const OUTDIR = KEY + '_notes/drafts-2026-10-07/';
const deck = fs.readFileSync(KEY + 'slides.html', 'utf8');
const data = JSON.parse(fs.readFileSync(OUTDIR + 'slide25-activity-data.json', 'utf8'));

const head = deck.slice(0, deck.indexOf('<div class="deck" id="deck">'))
  .replace(/<title>[^<]*<\/title>/, '<title>Draft · slide 25 activity — R/Pharma 2026 keynote</title>')
  .replace('<meta name="robots" content="noindex" />', '<meta name="robots" content="noindex" />'); // already noindex in the deck
const tail = deck.slice(deck.indexOf('<div class="notes-panel" id="notes"'));
if (!/noindex/.test(head)) throw new Error('expected the deck head to carry noindex');

const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
const MNAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
// monthly series as drawn: versioned releases whoever published them; issues and pull requests without bot-authored ones
const series = (key, y) => MONTHS.map(m => { const t = data.monthly_total[`${y}-${m}`]; return key === 'releases_versioned' ? t[key] : t[key] - t[key + '_by_bots']; });
const ytd = data.comparisons.ytd.variants.slide;
const nb = data.comparisons.ytd.variants.main;   // every author, for the notes
const pctTxt = p => (p > 0 ? '+' : '−') + Math.abs(Math.round(p)) + '%';
const f1 = n => Math.round(n * 10) / 10;

// expected values, asserted so a re-run on new data cannot silently leave stale words on the slide
const expect = { releases: [60, 47], issues_opened: [491, 594], issues_closed: [425, 466], prs_opened: [403, 484], prs_merged: [359, 401] };
for (const [m, [a, b]] of Object.entries(expect)) if (ytd[m].earlier !== a || ytd[m].later !== b) throw new Error(`data moved for ${m}: ${ytd[m].earlier} -> ${ytd[m].later}; rewrite the slide words`);

// ---------- option A: line chart, pull requests opened by month ----------
function chartA() {
  const a = series('prs_opened', 2025), b = series('prs_opened', 2026);
  const x0 = 78, x1 = 668, yb = 404, yt = 74, ymax = 90;
  const X = i => f1(x0 + i * (x1 - x0) / 8), Y = v => f1(yb - v * (yb - yt) / ymax);
  const path = s => s.map((v, i) => (i ? 'L' : 'M') + X(i) + ',' + Y(v)).join('');
  let o = '';
  for (const t of [0, 30, 60, 90]) o += `<line class="${t ? 'grid' : 'base'}" x1="${x0 - 8}" x2="${x1 + 8}" y1="${Y(t)}" y2="${Y(t)}"/><text class="tick" x="${x0 - 20}" y="${Y(t) + 8}">${t}</text>\n          `;
  o += MNAME.map((n, i) => `<text class="mo" x="${X(i)}" y="${yb + 36}">${n}</text>`).join('') + '\n          ';
  o += `<path class="l25" d="${path(a)}"/>\n          <path class="l26" d="${path(b)}"/>\n          `;
  o += a.map((v, i) => `<circle class="p25" cx="${X(i)}" cy="${Y(v)}" r="5"><title>${MNAME[i]} 2025: ${v} pull requests opened</title></circle>`).join('') + '\n          ';
  o += b.map((v, i) => `<circle class="p26" cx="${X(i)}" cy="${Y(v)}" r="7"><title>${MNAME[i]} 2026: ${v} pull requests opened</title></circle>`).join('') + '\n          ';
  // selective direct labels where the two lines are furthest apart: the 2026 peak (July) and the 2025 low (August)
  const k = b.map((v, i) => v - a[i]).reduce((best, d, i, arr) => d > arr[best] ? i : best, 0);
  o += `<text class="dl" x="${X(k)}" y="${Y(b[k]) - 20}" text-anchor="middle">2026</text>`;
  o += `<text class="dl" x="${X(k)}" y="${Y(a[k]) + 40}" text-anchor="middle">2025</text>`;
  const aria = `Line chart of pull requests opened each month, January to September, in 25 public repositories, leaving out pull requests opened by bots. 2025: ${a.join(', ')}. 2026: ${b.join(', ')}.`;
  return { svg: o, aria, a, b };
}

// ---------- option B: five cards, each a number and a two-line monthly chart ----------
const CARDS = [
  { key: 'releases', mkey: 'releases_versioned', l1: 'Releases', l2: 'published', ymax: 12 },
  { key: 'issues_opened', mkey: 'issues_opened', l1: 'Issues', l2: 'opened', ymax: 100 },
  { key: 'issues_closed', mkey: 'issues_closed', l1: 'Issues', l2: 'closed', ymax: 100 },
  { key: 'prs_opened', mkey: 'prs_opened', l1: 'Pull requests', l2: 'opened', ymax: 100 },
  { key: 'prs_merged', mkey: 'prs_merged', l1: 'Pull requests', l2: 'merged', ymax: 100 },
];
function chartB() {
  const W = 248, GAP = 20, H = 412;
  let o = '', aria = 'Five panels comparing 1 January to 6 October 2026 with the same dates in 2025, in 25 public repositories. ';
  CARDS.forEach((c, k) => {
    const x = k * (W + GAP), a = series(c.mkey, 2025), b = series(c.mkey, 2026);
    if (Math.max(...a, ...b) > c.ymax) throw new Error('ymax too small for ' + c.key);
    const px0 = x + 62, px1 = x + W - 22, yb = 352, yt = 218;
    const X = i => f1(px0 + i * (px1 - px0) / 8), Y = v => f1(yb - v * (yb - yt) / c.ymax);
    const path = s => s.map((v, i) => (i ? 'L' : 'M') + X(i) + ',' + Y(v)).join('');
    const m = ytd[c.key];
    o += `\n          <!-- ${c.l1} ${c.l2}: ${m.earlier} -> ${m.later}, ${m.change_pct}% -->
          <rect class="card" x="${x + 1}" y="1" width="${W - 2}" height="${H - 2}" rx="16"/>
          <text class="l1" x="${x + 22}" y="42">${c.l1}</text><text class="l2" x="${x + 22}" y="72">${c.l2}</text>
          <text class="chg" x="${x + 20}" y="140">${pctTxt(m.change_pct)}</text>
          <text class="cnt" x="${x + 22}" y="180">${m.earlier} → ${m.later}</text>
          <line class="grid" x1="${px0 - 6}" x2="${px1 + 6}" y1="${yt}" y2="${yt}"/><text class="tick" x="${px0 - 14}" y="${yt + 8}">${c.ymax}</text>
          <line class="base" x1="${px0 - 6}" x2="${px1 + 6}" y1="${yb}" y2="${yb}"/><text class="tick" x="${px0 - 14}" y="${yb + 8}">0</text>
          <path class="l25" d="${path(a)}"/><path class="l26" d="${path(b)}"/>
          ${b.map((v, i) => `<circle class="hit" cx="${X(i)}" cy="${Y(v)}" r="10"><title>${MNAME[i]}: ${a[i]} in 2025, ${v} in 2026</title></circle>`).join('')}
          <text class="mo ms" x="${px0 - 6}" y="${yb + 40}">Jan</text><text class="mo me" x="${px1 + 6}" y="${yb + 40}">Sep</text>`;
    aria += `${c.l1} ${c.l2}: ${m.earlier} last year, ${m.later} this year, ${pctTxt(m.change_pct).replace('−', 'minus ')}. `;
  });
  const ly = H + 40;
  o += `\n
          <!-- the legend: one entry per year, and what the lines cover -->
          <line class="l26" x1="2" x2="50" y1="${ly - 8}" y2="${ly - 8}"/><text class="lg" x="62" y="${ly}">2026</text>
          <line class="l25" x1="150" x2="198" y1="${ly - 8}" y2="${ly - 8}"/><text class="lg" x="210" y="${ly}">2025</text>
          <text class="lg s" x="304" y="${ly}">Lines: each month, January to September. Numbers: 1 January to 6 October.</text>`;
  return { svg: o, aria, vbH: ly + 12 };
}

const A = chartA(), B = chartB();
const QC = data.per_repo_ytd_slide['Gilead-Public/qcthat'].issues_opened, APP = data.per_repo_ytd_slide['Gilead-BioStats/gsm.app'].issues_opened;
const p = k => pctTxt(ytd[k].change_pct);
const row = (k, label) => `<br>• ${label}: ${ytd[k].earlier} → ${ytd[k].later} (${p(k)})` + (k === 'releases' ? '. Whoever published them, people or a workflow.' : `. With bot accounts counted too: ${nb[k].earlier} → ${nb[k].later} (${pctTxt(nb[k].change_pct)}).`);
const c = data.comparisons;
const cmp = (cc, k, v = 'slide') => `${cc.variants[v][k].earlier} → ${cc.variants[v][k].later} (${pctTxt(cc.variants[v][k].change_pct)})`;

const notes = which => `
        <strong class="say">&lt;none yet&gt;</strong>
        DRAFT, 2026-10-07. Every word on this slide is draft wording for Jeremy to replace; the
        numbers are sourced in slide25-activity-sources.md and slide25-activity-data.json, beside
        this file. Counted on 2026-10-07 between 11:42 and 11:52 UTC from GitHub's public API.
        <br><br>What is counted: the 25 public repositories of the gsm and OpenRBQM ecosystem
        (GitHub organisations Gilead-Public, Gilead-BioStats and OpenRBQM). Same calendar window in
        both years: 1 January to 6 October, in UTC. Issues and pull requests opened by bot
        accounts are left out (dependency updates, workflow-template updates, scheduled reports:
        4 pull requests in the 2025 window, 58 in 2026, and 20 issues in 2026).
        ${row('releases', 'Releases published (tags that look like a version)')}
        ${row('issues_opened', 'Issues opened')}
        ${row('issues_closed', 'Issues closed')}
        ${row('prs_opened', 'Pull requests opened')}
        ${row('prs_merged', 'Pull requests merged')}
        <br><br>The June post against the public record. The post (diary #1, 2026-06-10) said
        releases were up roughly 50% and issues and pull requests had roughly doubled. On public
        data, 1 January to 9 June, 2026 against 2025: releases ${cmp(c.blog_jan_to_9_jun, 'releases')},
        issues opened ${cmp(c.blog_jan_to_9_jun, 'issues_opened')}, issues closed ${cmp(c.blog_jan_to_9_jun, 'issues_closed')},
        pull requests opened ${cmp(c.blog_jan_to_9_jun, 'prs_opened')}, merged ${cmp(c.blog_jan_to_9_jun, 'prs_merged')}.
        Nothing doubled. The release figure does come back on a different window: the 12 months
        to 9 June 2026 against the 12 months before, ${cmp(c.blog_trailing_12m, 'releases')}. That window
        is helped by March 2025, when one package became several and each started releasing on its
        own. The post may also have counted repositories that are not public; that cannot be
        checked from here.
        <br><br>What moves the numbers (say it or not, Jeremy's call)
        <br>• One repository, qcthat, went from ${QC.y2025} issues opened to ${QC.y2026}. Without it, issues opened
        are ${cmp(c.ytd_without_qcthat, 'issues_opened')} and pull requests opened ${cmp(c.ytd_without_qcthat, 'prs_opened')}.
        <br>• One repository, gsm.app, went quiet in public: ${APP.y2025} issues opened in the 2025 window,
        ${APP.y2026} in 2026. Without it, issues opened are ${cmp(c.ytd_without_gsm_app, 'issues_opened')} and pull
        requests opened ${cmp(c.ytd_without_gsm_app, 'prs_opened')}.
        <br>• Releases fell partly because 2025 held the first releases of the new packages, and
        gsm.app and gsm.qc published 13 releases in the 2025 window and none in 2026.
        <br>• People: 14 accounts opened an issue or pull request in the 2025 window, 12 in 2026.
        That is a count of accounts, not of team size.
        ${which === 'A' ? `<br><br>The chart: pull requests opened in each whole month, January to September.
        2025: ${A.a.join(', ')}. 2026: ${A.b.join(', ')}. The headline number also counts 1 to 6 October
        (${ytd.prs_opened.earlier - A.a.reduce((x, y) => x + y, 0)} in 2025, ${ytd.prs_opened.later - A.b.reduce((x, y) => x + y, 0)} in 2026).` : `<br><br>The panels: the lines are whole months, January to September; the numbers
        also count 1 to 6 October. The four issue and pull request panels share one scale (0 to
        100 a month); releases has its own (0 to 12).`}
        <br><br>TODO (Jeremy)
        <br>• The public record does not support "+50% releases" or "roughly doubled". Use these
        numbers, or internal ones he can stand behind, but the slide should say which.
        <br>• The wrap-up slide after this one repeats "releases up about 50%; issues and pull
        requests roughly doubled". It needs the same change.
        <br>• Confirm the repository list (qcthat in, two unrelated public repositories out).
        <br>• Numbers stop at 6 October. Re-run the week of the talk.
        <br><br>Sources
        <br>- Method, commands and caveats: keynote/_notes/drafts-2026-10-07/slide25-activity-sources.md
        <br>- Monthly counts per repository: keynote/_notes/drafts-2026-10-07/slide25-activity-data.json
        <br>- Diary #1, 10 June 2026: https://jwildfire.github.io/2026/06/10/rpharma-keynote-developer-diary.html
      `;

const html = `${head}<div class="deck" id="deck">

    <!-- ============================================================
         DRAFT · slide 25 · "What changed" (drafted 2026-10-07, not in the deck).
         Two options for the same slide. Every word is draft wording for Jeremy to replace.
         Sources for every number: slide25-activity-sources.md and slide25-activity-data.json,
         beside this file. Built by a script from the data file; nothing is typed by hand
         except the words.
         To move one into keynote/slides.html: copy the small <style> block below and ONE of
         the two <section>s (each is delimited by BEGIN / END comments), replacing the section
         that holds the big "+50%". Take out the <p class="draft-tag"> line when the words are final.
         Colour: 2026 is the slide's hue (teal, #00afa9), 2025 is the deck's grey (--soft,
         #5b6470). Checked with the dataviz skill's validator against the paper background:
         colour-blind separation 17.8, normal-vision separation 21.2, both pass. The two lines
         also differ in weight, and each is named in words.
         ============================================================ -->
    <style>
      /* Activity, this year against last (slide 25 draft). */
      .slide .draft-tag { position: absolute; left: 140px; top: 40px; margin: 0; font-family: var(--mono); font-size: 22px; line-height: 1.3; color: var(--ink); background: #f5a83f; border: 2px dashed #9a5a12; border-radius: 10px; padding: 3px 14px; }
      .pvr.act .grid { stroke: var(--rule); stroke-width: 2; }
      .pvr.act .base { stroke: var(--faint); stroke-width: 2; }
      .pvr.act .tick { font-family: var(--mono); font-size: 23px; fill: var(--soft); text-anchor: end; }
      .pvr.act .mo { font-size: 23px; fill: var(--soft); text-anchor: middle; }
      .pvr.act .mo.ms { text-anchor: start; }
      .pvr.act .mo.me { text-anchor: end; }
      .pvr.act .l25 { fill: none; stroke: var(--soft); stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; }
      .pvr.act .l26 { fill: none; stroke: var(--hue); stroke-width: 6; stroke-linejoin: round; stroke-linecap: round; }
      .pvr.act .p25 { fill: var(--soft); stroke: var(--bg); stroke-width: 2; }
      .pvr.act .p26 { fill: var(--hue); stroke: var(--bg); stroke-width: 2; }
      .pvr.act .hit { fill: transparent; }
      .pvr.act .dl { font-size: 26px; font-weight: 600; fill: var(--ink); }
      .pvr.act .ttl { font-size: 28px; font-weight: 600; fill: var(--ink); }
      .pvr.act .card { fill: var(--panel); stroke: var(--rule); stroke-width: 2; }
      .pvr.act .l1 { font-size: 27px; font-weight: 600; fill: var(--ink); }
      .pvr.act .l2 { font-size: 24px; fill: var(--soft); }
      .pvr.act .chg { font-family: var(--serif); font-size: 76px; fill: var(--ink); }
      .pvr.act .cnt { font-size: 26px; fill: var(--ink); }
      .pvr.act .lg { font-size: 24px; fill: var(--ink); }
      .pvr.act .lg.s { fill: var(--soft); }
      /* Option A: the s-stat number (same gradient as .s-stat .big) beside a chart. */
      .act2 .cols { flex: 1; min-height: 0; display: flex; gap: 60px; align-items: center; }
      .act2 .lhs { flex: none; width: 540px; }
      .act2 .big { font-family: var(--serif); font-size: 230px; line-height: 0.9; background: var(--spec-gradient-diag); -webkit-background-clip: text; background-clip: text; color: transparent; }
      .act2 .lhs p { font-size: 34px; line-height: 1.35; margin: 26px 0 0; }
      .act2 .pvr { align-self: stretch; }
    </style>

    <!-- ===== BEGIN option A: the number, with a small monthly chart beside it ===== -->
    <section class="slide act2" data-hue="3">
      <p class="draft-tag">Draft 2026-10-07 · option A · every word is draft wording</p>
      <p class="kicker">What changed</p>
      <div class="cols">
        <div class="lhs">
          <div class="big">${p('prs_opened')}</div>
          <p>more pull requests in our public repos than by this date last year, bots left out. Issues opened are up ${Math.round(ytd.issues_opened.change_pct)}%. Releases are down ${Math.abs(Math.round(ytd.releases.change_pct))}%. <span class="soft">Not a controlled productivity study.</span></p>
        </div>
        <div class="pvr act">
          <svg viewBox="0 0 700 470" role="img" aria-label="${A.aria}">
          <text class="ttl" x="58" y="30">Pull requests opened each month</text>
          ${A.svg}
          </svg>
        </div>
      </div>
      <aside class="notes">${notes('A')}</aside>
    </section>
    <!-- ===== END option A ===== -->

    <!-- ===== BEGIN option B: chart-led, this year against last on all five measures ===== -->
    <section class="slide" data-hue="3">
      <p class="draft-tag">Draft 2026-10-07 · option B · every word is draft wording</p>
      <p class="kicker">What changed</p>
      <h2 style="font-size: 64px; margin-bottom: 18px">More issues and pull requests, fewer releases</h2>
      <div class="pvr act">
        <svg viewBox="0 0 1320 ${B.vbH}" role="img" aria-label="${B.aria}">${B.svg}
        </svg>
      </div>
      <p style="font-size: 30px; margin: 10px 0 0">Our 25 public repos, same dates each year, bots left out. <span class="soft">Not a controlled productivity study.</span></p>
      <aside class="notes">${notes('B')}</aside>
    </section>
    <!-- ===== END option B ===== -->

  </div>

  ${tail}`;
fs.writeFileSync(OUTDIR + 'slide25-activity.html', html);
console.log('wrote', OUTDIR + 'slide25-activity.html', html.length, 'bytes; B viewBox height', B.vbH);
