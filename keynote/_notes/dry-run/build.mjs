// Dry-run kit generator for the R/Pharma 2026 keynote.
// Reads ../../slides.html (never edits it) and writes, next to this script:
//   thumbs/01.png ... NN.png   800x450 thumbnail of each main-run slide (with ?reveal)
//   run-sheet.html             the page to rehearse from (phone and print friendly)
//   timing.md                  the beat table, slides with no spoken notes, every open TODO
//
// Regenerate:  node keynote/_notes/dry-run/build.mjs        (from the repo root)
//              node keynote/_notes/dry-run/build.mjs --no-thumbs   (text outputs only, keeps old thumbs)
//
// Needs Node and Playwright (Chromium). Playwright is looked up from the current directory first,
// then from $PLAYWRIGHT_FROM, then from the safety.viz checkout used on Jeremy's machine.

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DECK = path.resolve(HERE, '../../slides.html');
const THUMBS = path.join(HERE, 'thumbs');
const NO_THUMBS = process.argv.includes('--no-thumbs');

// ---- The talk's structure (from keynote/_notes/outline.md; confirm there if the deck is re-split) ----
const WPM = 140;
const BEATS = [
  { id: '1',   name: 'Opening',                from: 1,  to: 10, group: '1' },
  { id: '2a',  name: 'OpenRBQM without AI',    from: 11, to: 15, group: '2' },
  { id: '2b',  name: 'AI layered in',          from: 16, to: 26, group: '2' },
  { id: '3',   name: 'The obot journey',       from: 27, to: 46, group: '3' },
  { id: '3.5', name: 'How we built it',        from: 47, to: 51, group: '3.5' },
  { id: '4',   name: 'What we learned',        from: 52, to: 56, group: '4' },
];
// Suggested split on record (not decided): minutes per group. Beat 2 covers 2a and 2b together.
// 3.5 was carved out of 3 and 4 afterwards and has no minutes of its own.
const GROUP_MINUTES = { '1': 8, '2': 15, '3': 10, '3.5': null, '4': 7 };
const TOTAL_MINUTES = 40;

// ---- Playwright lookup ----
function loadPlaywright() {
  const tries = [process.cwd() + '/', process.env.PLAYWRIGHT_FROM, '/Users/jwildfire/Documents/obot2/safety.viz/'].filter(Boolean);
  for (const t of tries) {
    try { return createRequire(t.endsWith('/') ? t : t + '/')('playwright'); } catch (e) { /* try next */ }
  }
  throw new Error('Playwright not found. Set PLAYWRIGHT_FROM to a directory that can resolve it.');
}
const { chromium } = loadPlaywright();

const deckHtml = fs.readFileSync(DECK, 'utf8');
const fingerprint = crypto.createHash('sha1').update(deckHtml).digest('hex').slice(0, 10);

const browser = await chromium.launch();

// ---- 1. Extract the main run from the deck's DOM ----
const extractPage = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await extractPage.goto(pathToFileURL(DECK).href);
const slides = await extractPage.evaluate(() => {
  const all = Array.from(document.querySelectorAll('section.slide'));
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const norm = s => s.replace(/\s+/g, ' ');
  // Walk a node list into {html, text}: br -> br/newline, i/em kept, everything else flattened.
  function walk(nodes) {
    let html = '', text = '';
    (function rec(list) {
      for (const n of list) {
        if (n.nodeType === 3) { const t = norm(n.nodeValue); html += esc(t); text += t; }
        else if (n.nodeType === 1) {
          const tag = n.tagName;
          if (tag === 'BR') { html += '<br>'; text += '\n'; }
          else if (tag === 'I' || tag === 'EM') { html += '<i>'; rec(n.childNodes); html += '</i>'; }
          else rec(n.childNodes);
        }
      }
    })(nodes);
    return { html, text };
  }
  // Split on two or more br into paragraphs; tidy only the whitespace around line breaks.
  function paras(w) {
    const h = w.html.split(/(?:\s*<br>\s*){2,}/).map(s => s.replace(/\s*<br>\s*/g, '<br>').replace(/^(<br>)+|(<br>)+$/g, '').trim()).filter(Boolean);
    const t = w.text.split(/(?:[ \t]*\n[ \t]*){2,}/).map(s => s.replace(/[ \t]*\n[ \t]*/g, '\n').trim()).filter(Boolean);
    return { html: h, text: t };
  }
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  return all.filter(s => !s.hasAttribute('data-reserve')).map((s, i) => {
    const aside = s.querySelector('aside.notes');
    const sayEl = aside && aside.querySelector('strong.say');
    const sayRaw = sayEl ? clean(sayEl.textContent) : '';
    const hasSay = !!sayEl && sayRaw !== '<none yet>' && sayRaw !== '';
    const say = hasSay ? paras(walk(sayEl.childNodes)) : { html: [], text: [] };
    const rest = aside ? Array.from(aside.childNodes).filter(n => n !== sayEl) : [];
    const bg = paras(walk(rest));
    const q = sel => s.querySelector(sel);
    const kicker = clean(q('.kicker') && q('.kicker').textContent);
    let title = clean((q('h1') || q('h2') || {}).textContent);
    if (!title && q('blockquote')) title = clean(q('blockquote').textContent);
    if (!title && q('.big')) title = (kicker ? kicker + ': ' : '') + clean(q('.big').textContent);
    if (!title && q('iframe')) title = clean(q('iframe').getAttribute('title'));
    if (!title) title = kicker || '(untitled)';
    const boxes = Array.from(s.querySelectorAll('div.todo, div.review')).map(b => {
      const parts = Array.from(b.querySelectorAll('p, li')).map(e => clean(e.textContent)).filter(Boolean);
      const t = (parts.length ? parts.join(' / ') : clean(b.textContent)).replace(/^TODO \(Jeremy\):?\s*/, '');
      return t;
    });
    // Note TODOs: from each "TODO (Jeremy)" marker to the next marker or the end of its paragraph.
    const noteTodos = [];
    for (const p of bg.text) {
      const re = /TODO \(Jeremy\)/g; const idx = []; let m;
      while ((m = re.exec(p))) idx.push(m.index);
      idx.forEach((a, k) => {
        const seg = p.slice(a, k + 1 < idx.length ? idx[k + 1] : p.length);
        noteTodos.push(seg.replace(/^TODO \(Jeremy\)[:.]?\s*/, '').replace(/\s*\n\s*/g, ' / ').replace(/^\/\s*/, '').trim());
      });
    }
    return {
      n: i + 1, docIndex: all.indexOf(s), hue: s.getAttribute('data-hue'), layout: s.className.replace(/\bslide\b|\bactive\b|\brevealed\b/g, '').trim(),
      kicker, title, hasSay, sayHtml: say.html, sayText: say.text.join('\n\n'), bgHtml: bg.html, boxes, noteTodos,
    };
  });
});
await extractPage.close();

// ---- 2. Counts ----
const wordsOf = t => t.split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)).length;
for (const s of slides) {
  s.words = s.hasSay ? wordsOf(s.sayText) : 0;
  s.seconds = s.words / WPM * 60;
  s.todos = [...s.boxes.map(t => ({ where: 'on slide', text: t })), ...s.noteTodos.map(t => ({ where: 'in notes', text: t }))];
  const b = BEATS.find(b => s.n >= b.from && s.n <= b.to);
  if (!b) throw new Error('Slide ' + s.n + ' is outside every beat; update BEATS.');
  s.beat = b.id;
}
if (slides.length !== BEATS[BEATS.length - 1].to) console.warn('WARNING: the deck has ' + slides.length + ' main slides but the beat table ends at ' + BEATS[BEATS.length - 1].to + '. Update BEATS.');
for (const b of BEATS) {
  const ss = slides.filter(s => s.beat === b.id);
  b.slides = ss.length;
  b.withSay = ss.filter(s => s.hasSay).length;
  b.words = ss.reduce((a, s) => a + s.words, 0);
  b.todos = ss.reduce((a, s) => a + s.todos.length, 0);
  b.spokenMin = b.words / WPM;
}
const groups = {};
for (const b of BEATS) { const g = groups[b.group] = groups[b.group] || { slides: 0, words: 0 }; g.slides += b.slides; g.words += b.words; }
for (const b of BEATS) {
  const g = groups[b.group], min = GROUP_MINUTES[b.group];
  b.groupMin = min; b.groupSlides = g.slides;
  b.secPerSlide = min == null ? null : min * 60 / g.slides;
}
const g3 = groups['3'], g35 = groups['3.5'], g4 = groups['4'];
const shared35 = (GROUP_MINUTES['3'] * 60) / (g3.slides + g35.slides);
const totals = {
  slides: slides.length,
  withSay: slides.filter(s => s.hasSay).length,
  boxes: slides.reduce((a, s) => a + s.boxes.length, 0),
  noteTodos: slides.reduce((a, s) => a + s.noteTodos.length, 0),
  words: slides.reduce((a, s) => a + s.words, 0),
};
totals.todos = totals.boxes + totals.noteTodos;
totals.minutes = totals.words / WPM;
totals.slidesNoSay = totals.slides - totals.withSay;

// ---- 3. Thumbnails ----
if (!NO_THUMBS) {
  fs.mkdirSync(THUMBS, { recursive: true });
  for (const f of fs.readdirSync(THUMBS)) if (/^\d\d\.png$/.test(f)) fs.unlinkSync(path.join(THUMBS, f)); // only files this script makes
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 0.5 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(DECK).href + '?reveal#1');
  await page.addStyleTag({ content: '.hint, .notes-panel { display: none !important; }' });
  for (const s of slides) {
    await page.evaluate(h => { location.hash = '#' + h; }, s.docIndex + 1);
    await page.waitForFunction(h => document.querySelectorAll('section.slide')[h - 1].classList.contains('active'), s.docIndex + 1);
    const hasFrame = await page.evaluate(h => !!document.querySelectorAll('section.slide')[h - 1].querySelector('iframe[data-src]'), s.docIndex + 1);
    await page.waitForTimeout(hasFrame ? 1800 : 250);
    await page.evaluate(() => Promise.all(Array.from(document.images).map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
    await page.screenshot({ path: path.join(THUMBS, String(s.n).padStart(2, '0') + '.png'), animations: 'disabled' });
  }
  await ctx.close();
}
await browser.close();

// ---- 4. Output helpers ----
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r1 = x => (Math.round(x * 10) / 10).toFixed(1);
const r0 = x => String(Math.round(x));
const mmss = sec => { sec = Math.round(sec); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };
const trunc = (t, n = 230) => t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + '…';
const pad2 = n => String(n).padStart(2, '0');

function beatLine(b) {
  // The sentence under each beat header: slide count, minutes, seconds per slide.
  const parts = [b.slides + ' slides (' + b.from + '–' + b.to + ')'];
  if (b.group === '2') parts.push('beat 2 as a whole: ' + b.groupMin + ' min over ' + b.groupSlides + ' slides = ' + r0(b.secPerSlide) + ' s per slide');
  else if (b.group === '3.5') parts.push('no minutes in the suggested split (carved out of beats 3 and 4 afterwards); if beats 3 and 3.5 share the 10 min: ' + r0(shared35) + ' s per slide over ' + (g3.slides + g35.slides) + ' slides');
  else if (b.group === '3') parts.push(b.groupMin + ' min = ' + r0(b.secPerSlide) + ' s per slide (' + r0(shared35) + ' s if beat 3.5 shares these minutes)');
  else parts.push(b.groupMin + ' min = ' + r0(b.secPerSlide) + ' s per slide');
  parts.push('spoken notes so far: ' + b.withSay + ' of ' + b.slides + ' slides, ' + b.words + ' words, ' + r1(b.spokenMin) + ' min');
  return parts;
}

// ---- 5. timing.md ----
{
  const L = [];
  L.push('# Dry-run timing');
  L.push('');
  L.push('Generated from keynote/slides.html (fingerprint ' + fingerprint + ') by keynote/_notes/dry-run/build.mjs. Do not edit by hand; re-run the script after the deck changes.');
  L.push('');
  L.push('## Totals');
  L.push('');
  L.push('- Slides in the main run: ' + totals.slides);
  L.push('- Slides with his spoken notes: ' + totals.withSay + ' (no spoken notes yet: ' + totals.slidesNoSay + ')');
  L.push('- Open TODOs: ' + totals.todos + ' (' + totals.boxes + ' boxes on slides (orange TODO or blue review), ' + totals.noteTodos + ' "TODO (Jeremy)" items in notes)');
  L.push('- Words in his spoken notes: ' + totals.words + ', which take ' + r1(totals.minutes) + ' min at ' + WPM + ' words a minute');
  L.push('- Slot: ' + TOTAL_MINUTES + ' min; the suggested split below adds up to ' + Object.values(GROUP_MINUTES).reduce((a, b) => a + (b || 0), 0) + ' min and is not decided');
  L.push('');
  L.push('## Beats');
  L.push('');
  L.push('| Beat | Slides | Count | Suggested min | Seconds per slide | Spoken-notes slides | Spoken words | Spoken min |');
  L.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const b of BEATS) {
    const min = b.group === '2' ? b.groupMin + ' (2a + 2b)' : b.groupMin == null ? 'none' : String(b.groupMin);
    const sps = b.secPerSlide == null ? 'n/a' : r0(b.secPerSlide);
    L.push('| ' + b.id + ' ' + b.name + ' | ' + b.from + '–' + b.to + ' | ' + b.slides + ' | ' + min + ' | ' + sps + ' | ' + b.withSay + ' | ' + b.words + ' | ' + r1(b.spokenMin) + ' |');
  }
  L.push('');
  L.push('- Beat 2 has one allowance, 15 min, over 2a and 2b together (' + groups['2'].slides + ' slides, ' + r0(GROUP_MINUTES['2'] * 60 / groups['2'].slides) + ' s per slide).');
  L.push('- Beat 3.5 has no minutes in the suggested split. If beats 3 and 3.5 share the 10 min: ' + (g3.slides + g35.slides) + ' slides, ' + r0(shared35) + ' s per slide. If 3.5 comes out of beats 3 and 4 together (' + (GROUP_MINUTES['3'] + GROUP_MINUTES['4']) + ' min): ' + (g3.slides + g35.slides + g4.slides) + ' slides, ' + r0((GROUP_MINUTES['3'] + GROUP_MINUTES['4']) * 60 / (g3.slides + g35.slides + g4.slides)) + ' s per slide.');
  L.push('- Seconds per slide is the minutes in the split divided by the slides in the beat; spoken minutes count only the words he has written, at ' + WPM + ' words a minute, so slides with no spoken notes add nothing.');
  L.push('');
  L.push('## Slides with no spoken notes (' + totals.slidesNoSay + ')');
  L.push('');
  for (const s of slides.filter(s => !s.hasSay)) L.push('- ' + s.n + '. ' + s.title + ' (beat ' + s.beat + ')');
  L.push('');
  L.push('## Open TODOs (' + totals.todos + ')');
  L.push('');
  for (const s of slides) for (const t of s.todos) L.push('- Slide ' + s.n + ' (' + t.where + '): ' + t.text);
  L.push('');
  fs.writeFileSync(path.join(HERE, 'timing.md'), L.join('\n'));
}

// ---- 6. run-sheet.html ----
const CSS = `
:root { color-scheme: light dark; --bg:#fbfaf7; --fg:#1f2328; --soft:#59616b; --line:#d6d3cb; --card:#ffffff; --band:#ece9e1; --todo-bg:#fff1e0; --todo-line:#d9822b; --nosay-bg:#f3efe6; --accent:#1b6aa5; --bar:#ffffff; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#15171a; --fg:#e6e3dc; --soft:#a2a8b0; --line:#34383e; --card:#1c1f23; --band:#262a30; --todo-bg:#3a2a18; --todo-line:#d9822b; --nosay-bg:#23262b; --accent:#7fb8e6; --bar:#1c1f23; } }
:root[data-theme="dark"] { --bg:#15171a; --fg:#e6e3dc; --soft:#a2a8b0; --line:#34383e; --card:#1c1f23; --band:#262a30; --todo-bg:#3a2a18; --todo-line:#d9822b; --nosay-bg:#23262b; --accent:#7fb8e6; --bar:#1c1f23; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; overflow-wrap: anywhere; }
a { color: var(--accent); }
main { max-width: 1100px; margin: 0 auto; padding: 0 16px 80px; }
h1 { font-size: 1.5rem; margin: 20px 0 4px; }
h2 { font-size: 1.1rem; margin: 0; font-weight: 600; }
h3 { font-size: 1.05rem; margin: 0 0 6px; font-weight: 600; line-height: 1.3; display: flex; flex-wrap: wrap; gap: 0 .6em; }
h3 .t { flex: 1 1 0; min-width: 0; }
.sub { color: var(--soft); margin: 0 0 14px; font-size: .9rem; }
.totals { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin: 12px 0; }
.totals div { background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 8px 10px; }
.totals .v { display: block; font-size: 1.4rem; line-height: 1.2; }
.totals .l { color: var(--soft); font-size: .8rem; }
table.beats { border-collapse: collapse; width: 100%; font-size: .85rem; margin: 10px 0 6px; background: var(--card); }
table.beats th, table.beats td { border: 1px solid var(--line); padding: 4px 6px; text-align: right; }
table.beats th:not(:first-child), table.beats td:not(:first-child) { white-space: nowrap; }
@media (max-width: 480px) { table.beats { font-size: .72rem; } table.beats th, table.beats td { padding: 3px 4px; } }
table.beats th:first-child, table.beats td:first-child { text-align: left; }
table.beats th { background: var(--band); font-weight: 600; }
.note { color: var(--soft); font-size: .85rem; margin: 4px 0 12px; }
.beat { background: var(--band); border: 1px solid var(--line); border-radius: 6px; padding: 10px 12px; margin: 28px 0 10px; }
.beat ul { margin: 6px 0 0; padding-left: 1.1em; font-size: .85rem; color: var(--soft); }
.slide { display: grid; grid-template-columns: 1fr; gap: 10px; background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 12px; margin: 0 0 12px; break-inside: avoid; scroll-margin-top: 130px; }
.slide.now { outline: 3px solid var(--accent); }
.thumb img { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: 4px; aspect-ratio: 16 / 9; background: var(--band); }
.n { display: inline-block; min-width: 1.6em; color: var(--soft); font-variant-numeric: tabular-nums; }
.kicker { display: block; color: var(--soft); font-size: .8rem; font-weight: 400; }
.meta { color: var(--soft); font-size: .8rem; margin: 0 0 6px; }
.say { border-left: 3px solid var(--accent); padding: 2px 0 2px 10px; margin: 0 0 8px; }
.say p { margin: 0 0 .6em; }
.say p:last-child { margin-bottom: 0; }
.nosay { background: var(--nosay-bg); border: 1px dashed var(--line); border-radius: 4px; padding: 6px 10px; margin: 0 0 8px; color: var(--soft); }
ul.todos { list-style: none; margin: 0 0 8px; padding: 0; }
ul.todos li { background: var(--todo-bg); border-left: 3px solid var(--todo-line); padding: 4px 8px; margin: 0 0 4px; font-size: .85rem; }
ul.todos .w { color: var(--soft); }
details { font-size: .88rem; }
details summary { cursor: pointer; color: var(--soft); }
details p { margin: .5em 0; }
.actual { border: 1px solid var(--line); border-radius: 4px; min-height: 52px; padding: 4px 8px; color: var(--soft); font-size: .75rem; display: flex; align-items: flex-start; }
@media (min-width: 820px) {
  #sw .clock { flex: 1 1 auto; }
  #sw button { flex: 0 0 auto; padding: 6px 12px; }
  .actual { align-self: start; }
  .slide { grid-template-columns: 240px 1fr 120px; gap: 14px; }
  .actual { min-height: 80px; }
}
/* Stopwatch */
#sw { position: sticky; top: 0; z-index: 5; background: var(--bar); border-bottom: 1px solid var(--line); padding: 8px 16px; margin: 0 -16px; }
#sw .row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
#sw .clock { font-variant-numeric: tabular-nums; font-size: .9rem; flex: 1 1 100%; }
#sw button { flex: 1 1 0; white-space: nowrap; font: inherit; font-size: .9rem; padding: 7px 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--fg); cursor: pointer; }
#sw button#start { flex: 1.3 1 0; }
#sw button#next { flex: 2 1 0; }
#sw button.go { background: var(--accent); color: var(--bg); border-color: var(--accent); }
#summary { display: block; width: 100%; height: 14em; margin: 10px 0; font: .8rem/1.4 ui-monospace, Menlo, monospace; background: var(--card); color: var(--fg); border: 1px solid var(--line); border-radius: 6px; }
#summary[hidden] { display: none; }
footer { color: var(--soft); font-size: .8rem; margin-top: 24px; }
@media print {
  :root { --bg:#fff; --card:#fff; --fg:#000; }
  body { font-size: 11pt; }
  #sw, #summary, noscript { display: none; }
  main { max-width: none; padding: 0; }
  .slide { grid-template-columns: 150px 1fr 90px; padding: 6px; margin-bottom: 6px; }
  .beat { break-after: avoid; }
}
`;

function slideRow(s) {
  const id = 's' + s.n;
  const say = s.hasSay
    ? '<div class="say">' + s.sayHtml.map(h => '<p>' + h + '</p>').join('') + '</div>'
    : '<p class="nosay">No spoken notes yet</p>';
  const todos = s.todos.length
    ? '<ul class="todos">' + s.todos.map(t => '<li><span class="w">' + esc(t.where) + ':</span> ' + esc(trunc(t.text)) + '</li>').join('') + '</ul>'
    : '';
  const bg = s.bgHtml.length
    ? '<details><summary>Background notes</summary>' + s.bgHtml.map(h => '<p>' + h + '</p>').join('') + '</details>'
    : '';
  const meta = s.hasSay ? '<p class="meta">' + s.words + ' words, about ' + mmss(s.seconds) + ' at ' + WPM + ' a minute</p>' : '';
  return '<article class="slide" id="' + id + '" data-n="' + s.n + '">'
    + '<div class="thumb"><a href="../../slides.html#' + (s.docIndex + 1) + '"><img src="thumbs/' + pad2(s.n) + '.png" width="800" height="450" loading="lazy" alt="Slide ' + s.n + ': ' + esc(s.title) + '"></a></div>'
    + '<div class="body"><h3><span class="n">' + s.n + '</span><span class="t">' + esc(s.title) + (s.kicker && s.kicker !== s.title ? '<span class="kicker">' + esc(s.kicker) + '</span>' : '') + '</span></h3>'
    + meta + say + todos + bg + '</div>'
    + '<div class="actual">actual time</div></article>';
}

const beatTableRows = BEATS.map(b => {
  const min = b.group === '2' ? b.groupMin + '*' : b.groupMin == null ? 'none' : b.groupMin;
  return '<tr><td>' + b.id + ' ' + esc(b.name) + '</td><td>' + b.slides + '</td><td>' + min + '</td><td>' + (b.secPerSlide == null ? 'n/a' : r0(b.secPerSlide)) + '</td><td>' + b.words + '</td><td>' + r1(b.spokenMin) + '</td></tr>';
}).join('');

const sections = BEATS.map(b => {
  const lines = beatLine(b).map(p => '<li>' + esc(p) + '</li>').join('');
  return '<section class="beatgroup" id="beat-' + b.id.replace('.', '-') + '"><div class="beat"><h2>Beat ' + esc(b.id) + ' · ' + esc(b.name) + '</h2><ul>' + lines + '</ul></div>'
    + slides.filter(s => s.beat === b.id).map(slideRow).join('\n') + '</section>';
}).join('\n');

const swData = {
  slides: slides.map(s => ({ n: s.n, beat: s.beat, title: s.title })),
  beats: BEATS.map(b => ({ id: b.id, from: b.from, to: b.to, name: b.name, groupMin: b.groupMin, group: b.group })),
  groupMinutes: GROUP_MINUTES,
};

const JS = `
(function () {
  var D = ${JSON.stringify(swData)};
  var running = false, startedAt = 0, base = 0;      // elapsed = base + (now - startedAt) while running
  var idx = 0, lapStart = 0, laps = [];              // laps[i] = seconds spent on slide i+1
  var $ = function (id) { return document.getElementById(id); };
  function elapsed() { return (base + (running ? performance.now() - startedAt : 0)) / 1000; }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  function mark() {
    var rows = document.querySelectorAll('.slide.now'); for (var i = 0; i < rows.length; i++) rows[i].classList.remove('now');
    if (idx < D.slides.length && (running || laps.length || base)) { var el = $('s' + D.slides[idx].n); if (el) { el.classList.add('now'); } }
  }
  function render() {
    var t = elapsed(), done = idx >= D.slides.length;
    $('clock').textContent = (done ? 'Finished' : 'Slide ' + D.slides[idx].n + ' of ' + D.slides.length) + ' · this slide ' + fmt(done ? 0 : t - lapStart) + ' · total ' + fmt(t);
    $('start').textContent = running ? 'Stop' : (base > 0 ? 'Resume' : 'Start');
    $('start').className = running ? '' : 'go';
    $('next').disabled = done;
    $('back').disabled = laps.length === 0;
  }
  function tick() { render(); }
  function scrollTo() { var el = $('s' + D.slides[Math.min(idx, D.slides.length - 1)].n); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' }); }
  $('start').onclick = function () {
    if (running) { base += performance.now() - startedAt; running = false; if (idx >= D.slides.length || laps.length) showSummary(); }
    else { startedAt = performance.now(); running = true; $('summary').hidden = true; }
    mark(); render();
  };
  $('next').onclick = function () {
    if (!running) { startedAt = performance.now(); running = true; $('summary').hidden = true; }
    var t = elapsed(); laps.push(t - lapStart); lapStart = t; idx++;
    if (idx >= D.slides.length) { base += performance.now() - startedAt; running = false; showSummary(); }
    mark(); render(); if (idx < D.slides.length) scrollTo();
  };
  $('back').onclick = function () {
    if (!laps.length) return;
    var prev = laps.pop(); lapStart = lapStart - prev; idx--; mark(); render(); scrollTo();
  };
  $('reset').onclick = function () {
    running = false; base = 0; idx = 0; lapStart = 0; laps = []; $('summary').hidden = true; mark(); render();
  };
  function summaryText() {
    var t = elapsed(), out = [];
    var cur = idx < D.slides.length ? t - lapStart : 0;
    var all = laps.slice(); if (idx < D.slides.length && cur > 0) all.push(cur);
    out.push('Dry run: ' + all.length + ' of ' + D.slides.length + ' slides timed, total ' + fmt(t) + ' (slot 40:00)');
    var groups = {}, order = [];
    D.beats.forEach(function (b) {
      var sec = 0, cnt = 0;
      for (var n = b.from; n <= b.to; n++) if (all[n - 1] != null) { sec += all[n - 1]; cnt++; }
      var key = b.group; if (!groups[key]) { groups[key] = { sec: 0, cnt: 0, ids: [] }; order.push(key); }
      groups[key].sec += sec; groups[key].cnt += cnt; groups[key].ids.push(b.id);
      out.push('Beat ' + b.id + ' ' + b.name + ': ' + fmt(sec) + ' (' + cnt + '/' + (b.to - b.from + 1) + ' slides)');
    });
    order.forEach(function (g) {
      var m = D.groupMinutes[g]; var G = groups[g];
      out.push((G.ids.length > 1 ? 'Beats ' + G.ids.join(' + ') + ' together' : 'Beat ' + G.ids[0] + ' total') + ': ' + fmt(G.sec) + ' against ' + (m == null ? 'no suggested minutes' : m + ':00'));
    });
    out.push('Seconds per slide:');
    all.forEach(function (s, i) { out.push('  ' + D.slides[i].n + '  ' + fmt(s) + '  ' + D.slides[i].title); });
    return out.join('\\n');
  }
  function showSummary() { var ta = $('summary'); ta.value = summaryText(); ta.hidden = false; if (ta.scrollIntoView) ta.scrollIntoView({ block: 'center' }); }
  $('copy').onclick = function () {
    showSummary(); var ta = $('summary'), txt = ta.value;
    function fallback() { ta.focus(); ta.select(); try { document.execCommand('copy'); } catch (e) {} }
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).catch(fallback); else fallback(); } catch (e) { fallback(); }
    $('copy').textContent = 'Copied'; setTimeout(function () { $('copy').textContent = 'Copy'; }, 1500);
  };
  setInterval(tick, 250); render();
})();
`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Keynote Run Sheet</title>
<style>${CSS}</style>
</head>
<body>
<main>
<div id="sw">
  <div class="row">
    <span class="clock" id="clock">Slide 1 of ${slides.length} · this slide 0:00 · total 0:00</span>
    <button id="start" class="go" type="button">Start</button>
    <button id="next" type="button">Next slide</button>
    <button id="back" type="button" title="Undo the last Next slide">Back</button>
    <button id="reset" type="button">Reset</button>
    <button id="copy" type="button">Copy</button>
  </div>
</div>
<textarea id="summary" readonly hidden aria-label="Timing summary"></textarea>
<h1>Keynote run sheet</h1>
<p class="sub">R/Pharma 2026, Wednesday 21 October, 40-minute slot. Built from keynote/slides.html (fingerprint ${fingerprint}); regenerate with node keynote/_notes/dry-run/build.mjs after the deck changes.</p>
<div class="totals">
  <div><span class="v">${totals.slides}</span><span class="l">slides</span></div>
  <div><span class="v">${totals.withSay}</span><span class="l">with his spoken notes (${totals.slidesNoSay} without)</span></div>
  <div><span class="v">${totals.todos}</span><span class="l">open TODOs (${totals.boxes} boxes on slides, orange TODO or blue review, ${totals.noteTodos} in notes)</span></div>
  <div><span class="v">${totals.words}</span><span class="l">words in his spoken notes</span></div>
  <div><span class="v">${r1(totals.minutes)} min</span><span class="l">to say them at ${WPM} words a minute</span></div>
</div>
<table class="beats">
<tr><th>Beat</th><th>Slides</th><th>Min</th><th>s/slide</th><th>Words</th><th>Said min</th></tr>
${beatTableRows}
</table>
<p class="note">Minutes are the suggested split (8 / 15 / 10 / 7, not decided). *Beat 2's 15 minutes cover 2a and 2b together. Words and Said min count his spoken notes only. Beat 3.5 was carved out of beats 3 and 4 afterwards and has no minutes. Spoken minutes count only the words he has written.</p>
${sections}
<footer>Spoken-notes words exclude bullet marks and punctuation-only tokens. Slide thumbnails link to the slide in the deck.</footer>
</main>
<script>${JS}</script>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'run-sheet.html'), html);

console.log(JSON.stringify({
  slides: totals.slides, withSay: totals.withSay, noSay: totals.slidesNoSay, todoBoxes: totals.boxes, noteTodos: totals.noteTodos, todos: totals.todos,
  words: totals.words, minutes: Number(r1(totals.minutes)),
  beats: BEATS.map(b => ({ id: b.id, slides: b.slides, withSay: b.withSay, words: b.words, groupMin: b.groupMin, secPerSlide: b.secPerSlide == null ? null : Math.round(b.secPerSlide) })),
  fingerprint,
}, null, 1));
