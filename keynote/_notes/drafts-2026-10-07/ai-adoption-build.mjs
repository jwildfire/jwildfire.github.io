// Build ai-adoption-visual.html: the deck's own <head> (fonts, colours, slide frame) around three
// draft slides, each showing one small candidate visual (560 x 300) in the corner of a stand-in slide.
// Every number and every bar is computed from ai-adoption-data.json. keynote/slides.html is only read.
//
//   node ai-adoption-build.mjs      then      node ai-adoption-shot.cjs
import fs from 'node:fs';
const KEY = '/Users/jwildfire/Documents/github/jwildfire.github.io/.claude/worktrees/keynote-deck/keynote/';
const OUTDIR = KEY + '_notes/drafts-2026-10-07/';
const deck = fs.readFileSync(KEY + 'slides.html', 'utf8');
const D = JSON.parse(fs.readFileSync(OUTDIR + 'ai-adoption-data.json', 'utf8'));
const head = deck.slice(0, deck.indexOf('<div class="deck" id="deck">')).replace(/<title>[^<]*<\/title>/, '<title>Draft · AI adoption visuals — R/Pharma 2026 keynote</title>');
const tail = deck.slice(deck.indexOf('<div class="notes-panel" id="notes"'));
if (!/noindex/.test(head)) throw new Error('expected the deck head to carry noindex');

const f1 = n => Math.round(n * 10) / 10;
const rnd = x => Math.sign(x) * Math.round(Math.abs(x));            // halves away from zero
const pc = (n, d) => rnd(n / d * 100);                              // whole per cent straight from the counts, never from a rounded share
const chg = m => (m.y2026 / m.y2025 - 1) * 100;
const pctTxt = p => (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(rnd(p)) + '%';
const QS = ['2025Q1', '2025Q2', '2025Q3', '2025Q4', '2026Q1', '2026Q2', '2026Q3'];

// ---------- numbers, asserted so a re-run on new data cannot leave stale words on a slide ----------
const prQ = QS.map(q => D.ai_evidence.prs_by_quarter[q]);
const total = prQ.map(x => x.prs), marked = prQ.map(x => x.ai_written_any);
const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`data moved for ${what}: ${JSON.stringify(a)}; rewrite the slide words`); };
eq(total, [150, 147, 94, 67, 144, 167, 171], 'pull requests opened per quarter');
eq(marked, [0, 1, 5, 3, 9, 68, 80], 'pull requests carrying an agent mark per quarter');
const since = D.year_over_year.all_25.no_bots.Q2_Q3, before = D.year_over_year.all_25.no_bots.Q1;
eq([since.prs_opened, since.prs_merged, since.issues_opened, since.issues_closed, since.releases].map(m => [m.y2025, m.y2026]), [[241, 338], [220, 280], [314, 371], [285, 270], [41, 33]], 'April to September counts');
const tq = ['2025Q1', '2025Q2', '2025Q3', '2026Q1', '2026Q2', '2026Q3'].map(q => D.tests_in_merged_prs.all_25.by_quarter[q]);
eq(tq.map(x => [x.touch_a_test_file, x.prs_merged_with_commit_list]), [[49, 129], [58, 138], [22, 82], [66, 119], [88, 148], [74, 132]], 'merged pull requests touching a test');

// ---------- A: pull requests opened per quarter, with the part that carries an AI agent's mark ----------
function visA() {
  const x0 = 26, bw = 54, pitch = 74, yb = 234, k = 0.78;      // k px per pull request
  const gap = 20;                                               // extra space between the two years
  const X = i => x0 + i * pitch + (i >= 4 ? gap : 0);
  let o = `<text class="ttl" x="0" y="26">Pull requests opened each quarter</text>
          <rect class="b26" x="0" y="39" width="20" height="20" rx="3"/><text class="lg" x="30" y="57">carrying an AI agent’s mark</text>
          <line class="base" x1="${X(0) - 10}" x2="${X(6) + bw + 10}" y1="${yb}" y2="${yb}"/>`;
  total.forEach((t, i) => {
    const h = f1(t * k), hm = f1(marked[i] * k), x = X(i), share = marked[i] / t * 100;
    o += `\n          <rect class="b25" x="${x}" y="${f1(yb - h)}" width="${bw}" height="${f1(h - hm)}"/>`;
    if (hm > 0) o += `<rect class="b26" x="${x}" y="${f1(yb - hm)}" width="${bw}" height="${hm}"/>` + (hm >= 6 ? `<line class="gap" x1="${x}" x2="${x + bw}" y1="${f1(yb - hm)}" y2="${f1(yb - hm)}"/>` : '');
    o += `<text class="val" x="${x + bw / 2}" y="${f1(yb - h - 8)}">${t}</text>`;
    if (hm >= 30) o += `<text class="in" x="${x + bw / 2}" y="${f1(yb - hm / 2 + 8)}">${pc(marked[i], t)}%</text>`;
    o += `<text class="tick" x="${x + bw / 2}" y="${yb + 25}">Q${(i % 4) + 1}</text>`;
    o += `<title>${QS[i]}: ${t} pull requests opened by people, ${marked[i]} of them (${f1(share)}%) carrying an AI agent's mark</title>`;
  });
  o += `\n          <text class="yr" x="${X(0) + (3 * pitch + bw) / 2}" y="${yb + 57}">2025</text><text class="yr" x="${X(4) + (2 * pitch + bw) / 2}" y="${yb + 57}">2026</text>`;
  const aria = `Bar chart of pull requests opened by people in each quarter, 25 public repositories. ${QS.map((q, i) => `${q}: ${total[i]}, of which ${marked[i]} carry an AI agent's mark`).join('. ')}.`;
  return { svg: o, aria };
}

// ---------- B: April to September, 2026 against 2025, five measures ----------
const ROWS = [['prs_opened', 'Pull requests opened'], ['prs_merged', 'Pull requests merged'], ['issues_opened', 'Issues opened'], ['issues_closed', 'Issues closed'], ['releases', 'Releases']];
function visB() {
  const zero = 318, k = 3.4, y0 = 74, rh = 44, bh = 26;       // k px per percentage point
  let o = `<text class="ttl" x="0" y="26">April to September</text><text class="lg s" x="0" y="54">2026 against the same months of 2025</text>
          <line class="base" x1="${zero}" x2="${zero}" y1="${y0 - 6}" y2="${y0 + 5 * rh - 8}"/>`;
  ROWS.forEach(([key, label], i) => {
    const m = since[key], p = chg(m), y = y0 + i * rh, w = f1(Math.abs(p) * k);
    o += `\n          <text class="row" x="0" y="${y + 21}">${label}</text>`;
    o += p >= 0 ? `<rect class="b26" x="${zero}" y="${y}" width="${w}" height="${bh}"/><text class="val l" x="${f1(zero + w + 10)}" y="${y + 21}">${pctTxt(p)}</text>`
                : `<rect class="b25" x="${f1(zero - w)}" y="${y}" width="${w}" height="${bh}"/><text class="val l" x="${zero + 10}" y="${y + 21}">${pctTxt(p)}</text>`;
    o += `<title>${label}: ${m.y2025} in April to September 2025, ${m.y2026} in 2026 (${pctTxt(p)})</title>`;
  });
  const aria = `Bar chart of the change from April to September 2025 to the same months of 2026, 25 public repositories, bots left out. ${ROWS.map(([key, label]) => `${label}: ${since[key].y2025} to ${since[key].y2026}, ${pctTxt(chg(since[key])).replace('−', 'minus ')}`).join('. ')}.`;
  return { svg: o, aria };
}

// ---------- C: merged pull requests that add or change a test, by quarter, 2025 beside 2026 ----------
function visC() {
  const yb = 244, k = 2.5, bw = 62, x0 = 34, pitch = 180;     // k px per percentage point
  const share = x => x.touch_a_test_file / x.prs_merged_with_commit_list * 100;
  const s25 = tq.slice(0, 3).map(share), s26 = tq.slice(3).map(share);
  let o = `<text class="ttl" x="0" y="26">Merged pull requests that touch a test</text>
          <rect class="b25" x="0" y="39" width="20" height="20" rx="3"/><text class="lg" x="30" y="57">2025</text>
          <rect class="b26" x="110" y="39" width="20" height="20" rx="3"/><text class="lg" x="140" y="57">2026</text>
          <line class="base" x1="${x0 - 14}" x2="${x0 + 2 * pitch + 2 * bw + 6 + 14}" y1="${yb}" y2="${yb}"/>`;
  ['Jan–Mar', 'Apr–Jun', 'Jul–Sep'].forEach((lab, i) => {
    const x = x0 + i * pitch, a = s25[i], b = s26[i];
    o += `\n          <rect class="b25" x="${x}" y="${f1(yb - a * k)}" width="${bw}" height="${f1(a * k)}"/><text class="val" x="${x + bw / 2}" y="${f1(yb - a * k - 8)}">${rnd(a)}%</text>`;
    o += `<rect class="b26" x="${x + bw + 6}" y="${f1(yb - b * k)}" width="${bw}" height="${f1(b * k)}"/><text class="val" x="${x + bw + 6 + bw / 2}" y="${f1(yb - b * k - 8)}">${rnd(b)}%</text>`;
    o += `<text class="tick" x="${x + bw + 3}" y="${yb + 30}">${lab}</text>`;
    o += `<title>${lab}: ${tq[i].touch_a_test_file} of ${tq[i].prs_merged_with_commit_list} merged pull requests touched a test file in 2025 (${rnd(a)}%), ${tq[i + 3].touch_a_test_file} of ${tq[i + 3].prs_merged_with_commit_list} in 2026 (${rnd(b)}%)</title>`;
  });
  const aria = `Bar chart of the share of merged pull requests that add or change a test file, by quarter, 25 public repositories, bots left out. 2025: ${s25.map(v => rnd(v) + '%').join(', ')}. 2026: ${s26.map(v => rnd(v) + '%').join(', ')}.`;
  return { svg: o, aria };
}
const A = visA(), B = visB(), C = visC();

// ---------- words for the notes ----------
const c = D.ai_evidence, iq = QS.map(q => c.issues_by_quarter[q]);
const apr = { m: marked[5] + marked[6], t: total[5] + total[6], m25: marked[1] + marked[2], t25: total[1] + total[2] };
const jan = D.tests_in_merged_prs.all_25.windows.Jan_Sep;
const row = (w, k) => `${w[k].y2025} → ${w[k].y2026} (${pctTxt(chg(w[k]))})`;
const sets = D.year_over_year;
const NOTE_COMMON = `
        <br><br>What is counted: 25 public repositories of the gsm and OpenRBQM ecosystem (GitHub
        organisations Gilead-Public, Gilead-BioStats, OpenRBQM), fetched 2026-10-07 between 12:40
        and 12:53 UTC. Items opened by bot accounts are left out. Calendar quarters in UTC.
        <br>Method, every table, commands and caveats: ai-adoption-findings.md, beside this file.
        Numbers: ai-adoption-data.json. Activity is not output.`;
const notesA = `
        <strong class="say">&lt;none yet&gt;</strong>
        DRAFT, 2026-10-07. Candidate A, the recommended one. Every word on the visual is draft wording.
        <br><br>What it shows. Grey: pull requests opened by people in each quarter
        (${total.join(', ')}). Teal: the ones that carry an AI agent's mark (${marked.join(', ')}).
        A mark is any of: the team's attribution line in the description ("This PR was drafted by
        … using …"), a tool's own footer ("Generated with Claude Code"), or a commit co-authored
        by Claude or Copilot. A Copilot review, or a Copilot suggestion accepted in the browser,
        does not count as a mark here.
        <br><br>The true statement. Since April, ${apr.m} of ${apr.t} pull requests
        (${pc(apr.m, apr.t)}%) carry an AI agent's mark. In the same months of 2025 it was ${apr.m25} of ${apr.t25}
        (${f1(apr.m25 / apr.t25 * 100)}%). The step is in April 2026: January to March 2026 was ${marked[4]} of ${total[4]}.
        <br>• It is a floor. Work done with an agent and not marked is invisible.
        <br>• Every account that opened a pull request in July to September 2026 opened at least one marked one
        (${prQ[6].authors_with_ai_written} of ${prQ[6].authors}).
        <br>• Issues with the attribution line: ${iq.map(x => x.attribution_line).join(', ')} by quarter; ${iq[6].attribution_line} of ${iq[6].issues} (${pc(iq[6].attribution_line + iq[6].tool_footer, iq[6].issues)}%) in July to September 2026.
        <br><br>What it does not show. The bars are not higher than before. ${total[6]} is level with the
        busiest quarter in the record (170 in October to December 2022), and January to June 2025
        (${total[0]}, ${total[1]}) was nearly as busy with almost no marks. Do not say "record" or
        "doubled".${NOTE_COMMON}`;
const notesB = `
        <strong class="say">&lt;none yet&gt;</strong>
        DRAFT, 2026-10-07. Candidate B: the hypothesis, tested. Every word on the visual is draft wording.
        <br><br>April to September 2026 against April to September 2025, all 25 repositories, bots left out.
        April is where the AI marks step up (candidate A), so it is the window "since adoption".
        ${ROWS.map(([k, l]) => `<br>• ${l}: ${row(since, k)}`).join('')}
        <br><br>The unflattering cuts, to keep beside it
        <br>• January to March, before the step: ${ROWS.map(([k, l]) => `${l.toLowerCase()} ${row(before, k)}`).join('; ')}.
        <br>• July to September 2025 was a weak quarter (${total[2]} pull requests opened, against ${total[0]} and ${total[1]} in the two before it). Much of the rise is 2026 not repeating that dip.
        <br>• January to September: pull requests opened ${row(sets.all_25.no_bots.Jan_Sep, 'prs_opened')}, issues opened ${row(sets.all_25.no_bots.Jan_Sep, 'issues_opened')}, releases ${row(sets.all_25.no_bots.Jan_Sep, 'releases')}.
        <br>• Only repositories worked on in both years (8 of them), April to September: pull requests opened ${row(sets.active_both_years.no_bots.Q2_Q3, 'prs_opened')}, merged ${row(sets.active_both_years.no_bots.Q2_Q3, 'prs_merged')}, issues opened ${row(sets.active_both_years.no_bots.Q2_Q3, 'issues_opened')}, issues closed ${row(sets.active_both_years.no_bots.Q2_Q3, 'issues_closed')}, releases ${row(sets.active_both_years.no_bots.Q2_Q3, 'releases')}.
        <br>• Leaving out repositories new in 2026, April to September: pull requests opened ${row(sets.without_new_in_2026.no_bots.Q2_Q3, 'prs_opened')}, issues opened ${row(sets.without_new_in_2026.no_bots.Q2_Q3, 'issues_opened')}, issues closed ${row(sets.without_new_in_2026.no_bots.Q2_Q3, 'issues_closed')}, releases ${row(sets.without_new_in_2026.no_bots.Q2_Q3, 'releases')}.
        <br>• Releases are down in every repository set but one, and issues closed did not rise with issues opened.${NOTE_COMMON}`;
const notesC = `
        <strong class="say">&lt;none yet&gt;</strong>
        DRAFT, 2026-10-07. Candidate C: the shape of the work. Every word on the visual is draft wording.
        <br><br>Share of merged pull requests in which at least one commit adds or changes a test file
        (tests/testthat/test-*.R, or a JavaScript test file). January to September:
        ${jan.y2025.touch_a_test_file} of ${jan.y2025.prs_merged_with_commit_list} (${pc(jan.y2025.touch_a_test_file, jan.y2025.prs_merged_with_commit_list)}%) in 2025,
        ${jan.y2026.touch_a_test_file} of ${jan.y2026.prs_merged_with_commit_list} (${pc(jan.y2026.touch_a_test_file, jan.y2026.prs_merged_with_commit_list)}%) in 2026.
        Adding a brand-new test file: ${pc(jan.y2025.add_a_new_test_file, jan.y2025.prs_merged_with_commit_list)}% → ${pc(jan.y2026.add_a_new_test_file, jan.y2026.prs_merged_with_commit_list)}%.
        <br>• The same in the 8 repositories worked on in both years: ${(w => `${pc(w.y2025.touch_a_test_file, w.y2025.prs_merged_with_commit_list)}% → ${pc(w.y2026.touch_a_test_file, w.y2026.prs_merged_with_commit_list)}%`)(D.tests_in_merged_prs.active_both_years.windows.Jan_Sep)}.
        <br>• The rise starts in January to March 2026, one quarter before the AI marks step up. It fits the
        team's test-first convention as much as it fits the agents. Do not present it as caused by AI.
        <br>• It counts whether a test file was touched, not whether the tests are good.${NOTE_COMMON}`;

const stand = (n, title) => `
      <p class="draft-tag">Draft 2026-10-07 · candidate ${n} · every word is draft wording</p>
      <p class="kicker">Stand-in slide</p>
      <h2>${title}</h2>
      <div class="standin">The slide’s own content sits here. The visual is 560 × 300, bottom right.</div>`;

const html = `${head}<div class="deck" id="deck">

    <!-- ============================================================
         DRAFT · three candidate small visuals on "what changed since the team adopted AI
         coding agents" (drafted 2026-10-07, not in the deck). Each is one inline SVG,
         560 x 300, meant for a corner of an existing slide; here each sits bottom right on a
         stand-in slide. Built by ai-adoption-build.mjs from ai-adoption-data.json; nothing is
         typed by hand except the words. Sources: ai-adoption-findings.md.
         To use one: copy the small <style> block below and the <div class="aiv"> … </div> of
         the candidate (between BEGIN / END comments) into the slide, and position it there.
         Colour: teal is the slide hue (--spec-3, #00afa9); grey is the deck's --soft (#5b6470),
         the pair the earlier slide-25 draft checked with the dataviz validator (they differ in
         lightness as well as hue, so they hold in greyscale).
         In A, teal marks the pull requests carrying an AI agent's mark, not a year.
         ============================================================ -->
    <style>
      .slide .draft-tag { position: absolute; left: 140px; top: 40px; margin: 0; font-family: var(--mono); font-size: 22px; line-height: 1.3; color: var(--ink); background: #f5a83f; border: 2px dashed #9a5a12; border-radius: 10px; padding: 3px 14px; }
      .standin { margin-top: 40px; width: 640px; height: 330px; border: 2px dashed var(--rule); border-radius: 24px; display: grid; place-items: center; padding: 40px; font-family: var(--mono); font-size: 24px; line-height: 1.4; color: var(--faint); text-align: center; }
      /* The small visual. 560 x 300 at slide scale; nothing under 22px. */
      .aiv { position: absolute; right: 140px; bottom: 110px; width: 560px; height: 300px; }
      .aiv svg { display: block; width: 560px; height: 300px; overflow: visible; }
      .aiv text { font-family: var(--sans); }
      .aiv .ttl { font-size: 26px; font-weight: 600; fill: var(--ink); }
      .aiv .lg { font-size: 22px; fill: var(--ink); }
      .aiv .lg.s { fill: var(--soft); }
      .aiv .row { font-size: 23px; fill: var(--ink); }
      .aiv .val { font-size: 22px; font-weight: 600; fill: var(--ink); text-anchor: middle; }
      .aiv .val.l { text-anchor: start; font-size: 24px; }
      .aiv .in { font-size: 22px; font-weight: 700; fill: var(--ink); text-anchor: middle; }
      .aiv .tick { font-size: 22px; fill: var(--soft); text-anchor: middle; }
      .aiv .yr { font-family: var(--mono); font-size: 22px; fill: var(--soft); text-anchor: middle; letter-spacing: 0.08em; }
      .aiv .base { stroke: var(--faint); stroke-width: 2; }
      .aiv .b25 { fill: var(--soft); }
      .aiv .gap { stroke: var(--bg); stroke-width: 2; }
      .aiv .b26 { fill: var(--spec-3); }
    </style>

    <section class="slide" data-hue="3">${stand('A (recommended)', 'Nearly half of our pull requests now carry an agent’s mark')}
      <!-- ===== BEGIN candidate A ===== -->
      <div class="aiv" id="aiv-a">
        <svg viewBox="0 0 560 300" role="img" aria-label="${A.aria}">
          ${A.svg}
        </svg>
      </div>
      <!-- ===== END candidate A ===== -->
      <aside class="notes">${notesA}
      </aside>
    </section>

    <section class="slide" data-hue="3">${stand('B', 'More pull requests, fewer releases')}
      <!-- ===== BEGIN candidate B ===== -->
      <div class="aiv" id="aiv-b">
        <svg viewBox="0 0 560 300" role="img" aria-label="${B.aria}">
          ${B.svg}
        </svg>
      </div>
      <!-- ===== END candidate B ===== -->
      <aside class="notes">${notesB}
      </aside>
    </section>

    <section class="slide" data-hue="3">${stand('C', 'More of the work arrives with a test')}
      <!-- ===== BEGIN candidate C ===== -->
      <div class="aiv" id="aiv-c">
        <svg viewBox="0 0 560 300" role="img" aria-label="${C.aria}">
          ${C.svg}
        </svg>
      </div>
      <!-- ===== END candidate C ===== -->
      <aside class="notes">${notesC}
      </aside>
    </section>

  </div>

  ${tail}`;
fs.writeFileSync(OUTDIR + 'ai-adoption-visual.html', html);
console.log('wrote ai-adoption-visual.html', html.length, 'bytes');
console.log('A', total.join(','), '|', marked.join(','));
console.log('B', ROWS.map(([k]) => pctTxt(chg(since[k]))).join(' '));
console.log('C', tq.map(x => pc(x.touch_a_test_file, x.prs_merged_with_commit_list)).join(' '));
