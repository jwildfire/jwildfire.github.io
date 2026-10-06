#!/usr/bin/env node
// Step 2 of 2: draw the two roadmap slides' pictures from model.json, as static SVG.
//
//   node build.mjs                                         write treemap.svg, node-link.svg, counts.md
//   node build.mjs --inject ../beat4-roadmap-tree-draft.html   ...and replace the marked blocks in that file
//   node build.mjs --inject ../../slides.html              the same for the deck, once the slides are in it
//
// Options: --objective 353 (the objective the node-link slide fans out; default 353, Biomarker charts)
//          --orphans       draw the requirements that sit under no objective as one more block
//          --retired       draw retired requirements too (hatched)
//          --no-floor      size every objective strictly by its tasks, even if its name then has no room
//
// No network, no token, no dependencies: the layout is computed here and text is fitted with
// the measured character widths of Instrument Sans in font-widths.json. Nothing under 18px is
// written into either picture; a label that would not fit at 18px is dropped, not shrunk, and
// every dropped label is listed on the console.
//
// The injected blocks sit between HTML comment markers named roadmap-tree:treemap,
// roadmap-tree:node-link and roadmap-tree:counts (each with :start and :end).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const values = (name) => args.flatMap((a, i) => (a === `--${name}` && args[i + 1] ? [args[i + 1]] : []));
const OBJECTIVE = Number(values('objective')[0] ?? 353);
const SHOW_ORPHANS = flag('orphans'), SHOW_RETIRED = flag('retired'), FLOOR = flag('no-floor') ? 0 : 7;

const M = JSON.parse(await fs.readFile(path.join(HERE, 'model.json'), 'utf8'));
const WIDTHS = JSON.parse(await fs.readFile(path.join(HERE, 'font-widths.json'), 'utf8'));

// ---------------------------------------------------------------- the tracker's colours
// site/assets/styles.css in obot.roadmap, .tk-sw.* — in the order work moves, finished first.
const STAGES = ['Released', 'Review', 'In session', 'Ready', 'Backlog', 'Unstaged', 'Retired'];
const COLOR = { Backlog: '#efe4ef', Ready: '#d3aed3', 'In session': '#a367a4', Review: '#6c3270', Released: '#86efac', Retired: '#cbd5e1', Unstaged: '#fca5a5' };
const ON_DARK = { Review: 1, 'In session': 1 };
// A task wears the colour of the status it most resembles.
const PHASE_STAGE = { done: 'Released', 'in review': 'Review', open: 'Backlog', retired: 'Retired' };
const LEGEND = [['Released', 'Released · task done'], ['Review', 'Review · task in review'], ['In session', 'In session'], ['Ready', 'Ready'], ['Backlog', 'Backlog · task open'], ['Unstaged', 'No status'], ['Retired', 'Retired']];
const INK = '#1f2328', SOFT = '#5b6470', PAPER = '#fafaf8', PANEL = '#f3f4f1', EDGE = '#d5d8d3', LINK = '#b9bfc7';
const FAMILY = "'Instrument Sans', system-ui, sans-serif";
const MIN = 18;                 // nothing meant to be read is smaller than this
// A requirement's title is written on the treemap only if all of it fits at 18px. --keep 20 also
// allows a cut title that keeps at least 20 characters; the default writes no fragments.
const KEEP = Number(values('keep')[0] ?? Infinity);
const W = 1320, H = 488;        // the drawing's box on a 1600 x 900 slide
const LEG = 40;                 // the legend band along the bottom

// ---------------------------------------------------------------- helpers
const stageIdx = (s) => STAGES.indexOf(s);
const sum = (a, f) => a.reduce((t, x) => t + f(x), 0);
const f1 = (n) => Math.round(n * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
// Each picture carries its own hatch pattern, under its own id, so two pictures in one deck never share one.
let PIC = 'a';
const fillOf = (stage) => (stage === 'Retired' ? `url(#rt-ret-${PIC})` : COLOR[stage]);
const inkOn = (stage) => (ON_DARK[stage] ? '#fff' : INK);

// Text width in px, from the measured widths (in em) of Instrument Sans at 400 and 600, plus 2%.
function tw(s, px, wt = 400) {
  const table = WIDTHS[wt >= 600 ? 600 : 400];
  let em = 0;
  for (const ch of String(s)) em += table[ch] ?? 0.62;
  return em * px * 1.02;
}
function wrap(s, maxW, px, wt) {
  const lines = []; let cur = '';
  for (const w of s.split(/\s+/)) { const t = cur ? `${cur} ${w}` : w; if (tw(t, px, wt) <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; } }
  if (cur) lines.push(cur);
  return lines;
}
// The title in at most maxLines lines; cut with an ellipsis if it must be. Returns
// { lines, kept } where kept is how many characters of the title are still readable.
function fit(s, maxW, maxLines, px, wt) {
  if (maxLines < 1 || maxW < px * 3) return { lines: [], kept: 0 };
  let lines = wrap(s, maxW, px, wt), cut = false;
  if (lines.length > maxLines) { lines = lines.slice(0, maxLines); cut = true; }
  lines = lines.map((l, k) => {
    let out = l, needs = cut && k === lines.length - 1;
    while (out.length > 1 && tw(out + (needs ? '…' : ''), px, wt) > maxW) { out = out.slice(0, -1); needs = true; }
    if (needs) { cut = true; return out.replace(/[\s,;:—–-]+$/, '') + '…'; }
    return out;
  });
  return { lines, kept: cut ? lines.join(' ').replace(/…/g, '').length : s.length, full: !cut };
}
const text = (x, y, s, px, o = {}) => (s ? `<text x="${f1(x)}" y="${f1(y)}" font-size="${px}"${o.wt ? ` font-weight="${o.wt}"` : ''} fill="${o.fill || INK}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}>${esc(s)}</text>` : '');
const textLines = (x, y, ls, px, o) => ls.map((l, k) => text(x, y + k * px * 1.2, l, px, o)).join('');
const box = (x, y, w, h, fill, o = {}) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}"${o.rx ? ` rx="${o.rx}"` : ''} fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''}${o.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
const defs = () => `<defs><pattern id="rt-ret-${PIC}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#cbd5e1"/><rect width="2.5" height="6" fill="#94a3b8"/></pattern></defs>`;
const svg = (label, body) => `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" font-family="${FAMILY}">${defs()}${body}</svg>`;

// The tracker's stage bar: one segment per status, as wide as its share of the objective's requirements.
function stageBar(x, y, w, h, g) {
  let at = 0, s = '';
  for (const st of STAGES) {
    const n = g.byStage[st]; if (!n) continue;
    const len = w * n / g.reqs.length;
    s += box(x + at, y, Math.max(1, len - 1.5), h, fillOf(st), { rx: 2 });
    at += len;
  }
  return s;
}

// ---------------------------------------------------------------- the tree for a view
function group(o, isNone) {
  const reqs = o.requirements.filter((r) => SHOW_RETIRED || r.stage !== 'Retired')
    .map((r) => ({ ...r, units: Math.max(1, r.tasks.length) }))
    .sort((a, b) => stageIdx(a.stage) - stageIdx(b.stage) || b.tasks.length - a.tasks.length || a.n - b.n);
  const byStage = Object.fromEntries(STAGES.map((s) => [s, 0]));
  reqs.forEach((r) => { byStage[r.stage] += 1; });
  return { number: o.number, title: o.title, short: o.short, isNone, reqs, byStage, units: sum(reqs, (r) => r.units), nTasks: sum(reqs, (r) => r.tasks.length) };
}
function tally(gs) {
  const req = Object.fromEntries(STAGES.map((s) => [s, 0])), task = { done: 0, 'in review': 0, open: 0, retired: 0 };
  gs.forEach((g) => g.reqs.forEach((r) => { req[r.stage] += 1; r.tasks.forEach((t) => { task[t] += 1; }); }));
  return { req, task, nReq: sum(gs, (g) => g.reqs.length), nTask: sum(gs, (g) => g.nTasks) };
}
const retiredHidden = (objs) => (SHOW_RETIRED ? 0 : sum(objs, (o) => o.requirements.filter((r) => r.stage === 'Retired').length));

function legend(gs, shapes) {
  const t = tally(gs), y = H - 26, GAP = 24;
  let x = 0, s = '';
  const item = (mark, label, advance) => { s += mark(x) + text(x + advance, y + 19, label, 20); x += advance + tw(label, 20) + GAP; };
  if (!shapes) item((at) => box(at, y, 24, 24, PANEL, { rx: 4, stroke: '#98a0aa', sw: 1.5 }), 'Objective', 33);
  for (const [stage, label] of LEGEND) {
    const tasks = Object.keys(PHASE_STAGE).filter((p) => PHASE_STAGE[p] === stage);
    if (!t.req[stage] && !sum(tasks, (p) => t.task[p])) continue;
    // With retired requirements hidden, the only retired things left on the picture are tasks.
    item((at) => box(at, y, 24, 24, fillOf(stage), { rx: 4, stroke: 'rgba(0,0,0,.22)' }), stage === 'Retired' && !t.req.Retired ? 'Retired task' : label, 33);
  }
  if (shapes) {
    x += 14;
    item((at) => box(at, y + 1, 22, 22, PAPER, { rx: 4, stroke: SOFT, sw: 2 }), 'requirement', 31);
    item((at) => `<circle cx="${at + 11}" cy="${y + 12}" r="10" fill="${PAPER}" stroke="${SOFT}" stroke-width="2"/>`, 'task', 31);
  }
  if (x - GAP > W) console.warn(`  ! the legend is ${Math.round(x - GAP)}px wide and the drawing is ${W}px`);
  return s;
}

// ---------------------------------------------------------------- slide A · treemap (squarified)
function squarify(items, x, y, w, h) {
  const total = sum(items, (i) => i.v);
  if (!total || w <= 0 || h <= 0) { items.forEach((i) => Object.assign(i, { x, y, w: 0, h: 0 })); return; }
  const scale = w * h / total; let R = { x, y, w, h }, row = []; const rest = items.slice();
  const worst = (r, side) => { const s = sum(r, (i) => i.v) * scale; let mx = 0, mn = Infinity; r.forEach((i) => { const a = i.v * scale; mx = Math.max(mx, a); mn = Math.min(mn, a); }); return Math.max(side * side * mx / (s * s), s * s / (side * side * mn)); };
  const place = (r) => {
    const s = sum(r, (i) => i.v) * scale;
    if (R.w >= R.h) { const cw = s / R.h; let yy = R.y; r.forEach((i) => { const ih = i.v * scale / cw; Object.assign(i, { x: R.x, y: yy, w: cw, h: ih }); yy += ih; }); R = { x: R.x + cw, y: R.y, w: R.w - cw, h: R.h }; }
    else { const rh = s / R.w; let xx = R.x; r.forEach((i) => { const iw = i.v * scale / rh; Object.assign(i, { x: xx, y: R.y, w: iw, h: rh }); xx += iw; }); R = { x: R.x, y: R.y + rh, w: R.w, h: R.h - rh }; }
  };
  while (rest.length) {
    const side = Math.min(R.w, R.h);
    if (!row.length || worst(row.concat([rest[0]]), side) <= worst(row, side)) row.push(rest.shift());
    else { place(row); row = []; }
  }
  if (row.length) place(row);
}

function treemap(gs) {
  const TH = H - LEG - 6, GAP = 8, report = { objectives: [], unlabelledObjectives: [], requirements: [], floored: [] };
  // Area is one unit per task (one for a requirement with none). An objective smaller than
  // FLOOR units is drawn at FLOOR, so that its name has room at 18px; each one is reported.
  const items = gs.map((g) => ({ g, v: Math.max(g.units, FLOOR) })).sort((a, b) => (a.g.isNone ? 1 : 0) - (b.g.isNone ? 1 : 0) || b.v - a.v || a.g.number - b.g.number);
  gs.forEach((g) => { if (g.units < FLOOR) report.floored.push(`${g.short} (${g.units} drawn as ${FLOOR})`); });
  // The floored objectives stack in one column on the right, so each gets a block wide enough
  // for its name; the rest are squarified in what remains.
  const small = items.filter((i) => i.g.units < FLOOR && !i.g.isNone), big = items.filter((i) => !small.includes(i));
  const colW = small.length ? (W + GAP) * sum(small, (i) => i.v) / sum(items, (i) => i.v) : 0;
  squarify(big, -GAP / 2, -GAP / 2, W + GAP - colW, TH + GAP);
  let sy = -GAP / 2;
  for (const i of small) { const ih = (TH + GAP) * i.v / sum(small, (k) => k.v); Object.assign(i, { x: W + GAP / 2 - colW, y: sy, w: colW, h: ih }); sy += ih; }
  let s = '';
  for (const it of items) {
    const g = it.g, x = it.x + GAP / 2, y = it.y + GAP / 2, w = it.w - GAP, h = it.h - GAP;
    s += box(x, y, w, h, PANEL, { rx: 6, stroke: g.isNone ? '#98a0aa' : EDGE, sw: 1.5, dash: g.isNone });
    // The objective's name: 20px on one line with the stage bar beside it; else two lines; else 18px; else nothing.
    let hh = 0;
    const one = (px) => tw(g.short, px, 600) <= w - 16;
    if (one(20) || one(MIN)) {
      const px = one(20) ? 20 : MIN, room = w - 16 - tw(g.short, px, 600) - 18;
      hh = 34;
      s += text(x + 8, y + 24, g.short, px, { wt: 600 });
      if (room >= 60) { const bw = Math.min(room, 190); s += stageBar(x + w - 8 - bw, y + 12, bw, 12, g); }
      report.objectives.push(g.short);
    } else {
      const two = fit(g.short, w - 14, 2, MIN, 600);
      if (two.full && h >= 54 + 22) { hh = 52; s += textLines(x + 8, y + 22, two.lines, MIN, { wt: 600 }); report.objectives.push(g.short); }
      else report.unlabelledObjectives.push(`${g.short} (${Math.round(w)} x ${Math.round(h)}px)`);
    }
    const pad = 4, ritems = g.reqs.map((r) => ({ r, v: r.units })).sort((a, b) => b.v - a.v);
    squarify(ritems, x + pad, y + (hh || pad), w - 2 * pad, h - (hh || pad) - pad);
    for (const ri of ritems) {
      const r = ri.r, rx = ri.x + 1.5, ry = ri.y + 1.5, rw = ri.w - 3, rh = ri.h - 3;
      if (rw < 1 || rh < 1) continue;
      s += box(rx, ry, rw, rh, fillOf(r.stage), { rx: 3, stroke: 'rgba(0,0,0,.18)' });
      const ink = inkOn(r.stage);
      // A requirement's title is written only when all of it, or at least KEEP characters, survive at 18px.
      if (!r.tasks.length) {
        const l = fit(r.title, rw - 12, Math.min(3, Math.floor((rh - 8) / (MIN * 1.2))), MIN);
        if (l.full || l.kept >= KEEP) { s += textLines(rx + 6, ry + 21, l.lines, MIN, { fill: ink }); report.requirements.push(`#${r.n} ${l.lines.join(' ')}`); }
        continue;
      }
      let lh = 0;
      const l = fit(r.title, rw - 12, rh >= 100 ? 2 : 1, MIN, 600);
      if ((l.full || l.kept >= KEEP) && rh - l.lines.length * MIN * 1.2 - 10 >= 38) {
        lh = l.lines.length * MIN * 1.2 + 8;
        s += textLines(rx + 6, ry + 21, l.lines, MIN, { wt: 600, fill: ink });
        report.requirements.push(`#${r.n} ${l.lines.join(' ')}`);
      }
      const p = 4, titems = r.tasks.slice().sort((a, b) => stageIdx(PHASE_STAGE[a]) - stageIdx(PHASE_STAGE[b])).map((t) => ({ t, v: 1 }));
      squarify(titems, rx + p, ry + (lh || p), rw - 2 * p, rh - (lh || p) - p);
      for (const ti of titems) s += box(ti.x + 1, ti.y + 1, ti.w - 2, ti.h - 2, fillOf(PHASE_STAGE[ti.t]), { rx: 2, stroke: PAPER, sw: 1.5 });
    }
  }
  const t = tally(gs);
  const label = `A treemap of the obot roadmap on ${M.asOf}: ${plural(gs.filter((g) => !g.isNone).length, 'objective')} as blocks, each holding its requirements, each holding its tasks, ${t.nReq} requirements and ${t.nTask} tasks in all, sized by number of tasks and coloured by status.`;
  return { svg: svg(label, s + legend(gs, false)), report };
}

// ---------------------------------------------------------------- slide B · node-link tree
function nodeLink(g) {
  const TH = H - LEG - 6, report = { cut: [] };
  // One row per requirement; its tasks are a row of beads, one each, with the count after them.
  const rowH = Math.min(40, TH / g.reqs.length), total = rowH * g.reqs.length, top = (TH - total) / 2;
  if (rowH < MIN * 1.45) console.warn(`  ! ${g.reqs.length} requirements leave ${f1(rowH)}px a row: too tight for ${MIN}px titles on one slide`);
  const maxTasks = Math.max(1, ...g.reqs.map((r) => r.tasks.length));
  const BEAD = Math.min(20, rowH - 12), STEP = BEAD + 5, XC = W, XB = XC - 24 - maxTasks * STEP;
  const XL = 172, XO = 182, XN = 238, SQ = 22, XT = XN + SQ + 12;
  // The largest title size, 22 down to 18, at which every title fits on its line.
  const maxW = XB - 22 - XT;
  let px = 22; while (px > MIN && g.reqs.some((r) => tw(r.title, px) > maxW)) px -= 1;
  let s = '', links = '', y = top;
  const gy = top + total / 2;
  const name = wrap(g.short, XL, 28, 600);
  const nameTop = gy - (name.length - 1) * 17 - 22;
  s += textLines(XL, nameTop, name, 28, { wt: 600, anchor: 'end' });
  const under = nameTop + (name.length - 1) * 33.6 + 16;
  s += stageBar(XL - 150, under, 150, 12, g);
  s += text(XL, under + 38, plural(g.reqs.length, 'requirement'), MIN, { fill: SOFT, anchor: 'end' });
  s += text(XL, under + 62, plural(g.nTasks, 'task'), MIN, { fill: SOFT, anchor: 'end' });
  for (const r of g.reqs) {
    const cy = y + rowH / 2;
    links += `<path d="M${XO} ${f1(gy)}C${f1((XO + XN) / 2)} ${f1(gy)} ${f1((XO + XN) / 2)} ${f1(cy)} ${XN - 2} ${f1(cy)}"/>`;
    s += box(XN, cy - SQ / 2, SQ, SQ, fillOf(r.stage), { rx: 4, stroke: 'rgba(0,0,0,.3)' });
    const l = fit(r.title, maxW, 1, px);
    if (!l.full) report.cut.push(`#${r.n} ${r.title}`);
    s += text(XT, cy + px * 0.35, l.lines[0], px);
    const ts = r.tasks.slice().sort((a, b) => stageIdx(PHASE_STAGE[a]) - stageIdx(PHASE_STAGE[b]));
    if (ts.length) {
      links += `<path d="M${f1(XT + tw(l.lines[0], px) + 12)} ${f1(cy)}H${f1(XB - 8)}"/>`;
      ts.forEach((t, k) => { s += `<circle cx="${f1(XB + k * STEP + BEAD / 2)}" cy="${f1(cy)}" r="${f1(BEAD / 2)}" fill="${fillOf(PHASE_STAGE[t])}" stroke="rgba(0,0,0,.32)"/>`; });
      s += text(XC, cy + MIN * 0.35, String(ts.length), MIN, { fill: SOFT, anchor: 'end' });
    }
    y += rowH;
  }
  const t = tally([g]);
  const label = `A tree for one objective of the obot roadmap on ${M.asOf}: ${g.short} on the left, linked to its ${plural(g.reqs.length, 'requirement')}, each followed by one bead per task, ${t.nTask} tasks in all, coloured by status.`;
  report.px = px; report.rowH = rowH;
  return { svg: svg(label, `<g fill="none" stroke="${LINK}" stroke-width="1.6">${links}</g>` + s + legend([g], true)), report };
}

// ---------------------------------------------------------------- build
const objectives = M.objectives.map((o) => group(o, false)).filter((g) => g.reqs.length);
const orphans = group({ number: 'none', title: 'Requirements under no objective', short: 'No objective', requirements: M.unparented }, true);
const all = SHOW_ORPHANS && orphans.reqs.length ? objectives.concat([orphans]) : objectives;
const one = objectives.find((g) => g.number === OBJECTIVE);
if (!one) throw new Error(`build: objective #${OBJECTIVE} is not in model.json`);

PIC = 'a'; const A = treemap(all);
PIC = 'b'; const B = nodeLink(one);
const tA = tally(all), tB = tally([one]);
const hiddenRetired = retiredHidden(M.objectives) + (SHOW_ORPHANS ? retiredHidden([{ requirements: M.unparented }]) : 0);
const hiddenOrphans = SHOW_ORPHANS ? 0 : M.unparented.length;
const hiddenB = retiredHidden([M.objectives.find((o) => o.number === OBJECTIVE)]);

const hiddenNote = [hiddenRetired ? `${plural(hiddenRetired, 'retired requirement')}` : '', hiddenOrphans ? `${hiddenOrphans} with no objective` : ''].filter(Boolean).join(' and ');
const stampA = `obot.roadmap · as of ${M.asOf}${hiddenNote ? ` · ${hiddenNote} not shown` : ''}`;
const stampB = `obot.roadmap · as of ${M.asOf} · one bead per task${hiddenB ? ` · ${plural(hiddenB, 'retired requirement')} not shown` : ''}`;
const stageList = (t) => STAGES.filter((s) => t.req[s]).map((s) => `${t.req[s]} ${s.toLowerCase()}`).join(', ');
const taskList = (t) => ['done', 'in review', 'open', 'retired'].filter((p) => t.task[p]).map((p) => `${t.task[p]} ${p}`).join(', ');
const T = M.totals, S = T.requirements.byStage;
const counts = [
  `Snapshot: ${M.asOf}, ${M.asOfTime}, read from GitHub through the tracker's collector.`,
  `On the hub in all: ${T.objectives.total} objectives; ${T.requirements.total} requirements (${STAGES.filter((s) => S[s]).map((s) => `${S[s]} ${s.toLowerCase()}`).join(', ')}); ${T.tasks.total} tasks (${T.tasks.done} done, ${T.tasks.inReview} in review, ${T.tasks.open} open, ${T.tasks.retired} retired); ${T.unparented} requirements under no objective.`,
  `Drawn on the treemap: ${plural(all.filter((g) => !g.isNone).length, 'objective')}, ${tA.nReq} requirements (${stageList(tA)}), ${tA.nTask} tasks (${taskList(tA)}).${hiddenNote ? ` Not drawn: ${hiddenNote}.` : ''}`,
  `Drawn on the tree: ${one.short}, ${tB.nReq} requirements (${stageList(tB)}), ${tB.nTask} tasks (${taskList(tB)}).`,
];

const blocks = {
  treemap: `<div class="tree">${A.svg}</div>\n      <p class="stamp">${esc(stampA)}</p>`,
  'node-link': `<div class="tree">${B.svg}</div>\n      <p class="stamp">${esc(stampB)}</p>`,
  counts: counts.map(esc).join('\n        <br>'),
};

await fs.writeFile(path.join(HERE, 'treemap.svg'), A.svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ') + '\n');
await fs.writeFile(path.join(HERE, 'node-link.svg'), B.svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ') + '\n');
await fs.writeFile(path.join(HERE, 'counts.md'), `# Roadmap tree snapshot\n\n${counts.map((c) => `- ${c}`).join('\n')}\n- Slide A caption: ${stampA}\n- Slide B caption: ${stampB}\n\n## Readable on slide A\n\nObjective names: ${A.report.objectives.join('; ')}\n\nObjectives too small for a name at 18px: ${A.report.unlabelledObjectives.join('; ') || 'none'}\n\nObjectives drawn at the minimum size instead of their true size: ${A.report.floored.join('; ') || 'none'}\n\nRequirement titles:\n\n${A.report.requirements.map((r) => `- ${r}`).join('\n')}\n\n## Readable on slide B\n\n${one.reqs.map((r) => `- #${r.n} ${r.title}`).join('\n')}\n`);

for (const target of values('inject')) {
  const file = path.resolve(target);
  let html = await fs.readFile(file, 'utf8'), done = [];
  for (const [name, content] of Object.entries(blocks)) {
    const re = new RegExp(`(<!-- roadmap-tree:${name}:start -->)[\\s\\S]*?(<!-- roadmap-tree:${name}:end -->)`, 'g');
    let n = 0;
    html = html.replace(re, (_, a, b) => { n += 1; return `${a}\n      ${content}\n      ${b}`; });
    done.push(`${name} x${n}`);
  }
  await fs.writeFile(file, html);
  console.log(`build: injected into ${path.relative(process.cwd(), file)} (${done.join(', ')})`);
}

console.log(`build: ${M.asOf}`);
counts.forEach((c) => console.log(`  ${c}`));
if (A.report.floored.length) console.log(`  treemap: drawn larger than their task count so the name fits: ${A.report.floored.join('; ')}`);
console.log(`  treemap: ${A.report.objectives.length} objective names, ${A.report.requirements.length} requirement titles written` + (A.report.unlabelledObjectives.length ? `; NO ROOM for a name on: ${A.report.unlabelledObjectives.join('; ')}` : ''));
console.log(`  tree: titles at ${B.report.px}px, rows ${f1(B.report.rowH)}px` + (B.report.cut.length ? `; CUT SHORT: ${B.report.cut.join('; ')}` : ''));
console.log('  wrote treemap.svg, node-link.svg, counts.md');
