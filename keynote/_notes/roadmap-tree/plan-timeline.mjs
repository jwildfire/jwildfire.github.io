#!/usr/bin/env node
// The animated plan slide (2026-10-18): one objective's requirements and tasks on a time axis,
// with the releases of its two packages underneath, beside a sidebar of every objective.
//
//   node plan-timeline.mjs --fetch                          read GitHub with the gh CLI (reads only)
//                                                           and save plan-timeline.json
//   node plan-timeline.mjs --inject ../../keynote_extended.html
//                                                           write the slide's markup between the
//                                                           roadmap-tree:plan-timeline:start/end markers
//
// Separate from fetch.mjs and build.mjs on purpose: those draw the static reserve pictures from
// model.json (7 October), and their outputs stay as they are. This one keeps open and close
// times, which model.json does not. The deck's own script animates the markup (it looks for
// .s-plan); the markup on its own is the final state, so the slide is complete with no script.
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(HERE, 'plan-timeline.json');
const args = process.argv.slice(2);
const values = (name) => args.flatMap((a, i) => (a === `--${name}` && args[i + 1] ? [args[i + 1]] : []));
const OBJECTIVE = 353;
const HUB = 'jwildfire/obot.roadmap';
const PACKAGES = ['jwildfire/bio.viz', 'jwildfire/gsm.bio'];

// Short names for the requirements, written to fit the slide's title column at 18px.
// Each keeps the head of the issue title; the full titles are in plan-timeline.json.
const SHORT = {
  354: "safety.viz's shared parts, opened up",
  355: "Group comparison, the picture",
  356: "Group comparison, the tests",
  357: "Association scatter, correlation matrix",
  358: "Biomarker screen",
  359: "Cross-tabulation and the cut rule",
  360: "Stratified survival",
  361: "Results out of the browser",
  362: "Results out of R",
  363: "R in the browser, measured",
  364: "gsm.bio's statistics",
  366: "The demo app hosts the charts",
  367: "Group comparison over time",
  369: "bio.viz's site, styled as safety.viz's",
  371: "The difference grid, a second view",
  399: "An R app for the biomarker charts",
  400: "The biomarker app as a web app",
};

// Sidebar names that would not fit the sidebar at 18px; the rest are the head of the title.
const SHORT_GOAL = { 72: 'R/Pharma keynote deck', 73: 'Autonomy in obot.agent' };
// Capitalised for the list, except a package name (open.csr).
const goalName = (o) => SHORT_GOAL[o.number] || (/^[a-z]+\.[a-z]/.test(o.short) ? o.short : o.short[0].toUpperCase() + o.short.slice(1));

const gh = (...a) => JSON.parse(execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 64 << 20 }));
const subIssues = (repo, n) => gh('api', `repos/${repo}/issues/${n}/sub_issues?per_page=100`, '--paginate', '--slurp').flat();
const statusOf = (labels) => (labels.map((l) => l.name).find((x) => x.startsWith('status: ')) || 'status: none').slice(8);

async function fetchAll() {
  const objs = gh('issue', 'list', '-R', HUB, '--label', 'objective', '--state', 'all', '--limit', '100', '--json', 'number,title,state,milestone');
  const unscheduled = (o) => !o.milestone || o.milestone.title.toLowerCase() === 'backlog';
  objs.sort((a, b) => (a.state !== b.state ? (a.state === 'OPEN' ? -1 : 1) : unscheduled(a) !== unscheduled(b) ? (unscheduled(a) ? 1 : -1) : a.number - b.number));
  const objectives = [];
  let focus = null;
  for (const o of objs) {
    // Requirements only, and not the retired ones (closed as not planned), as on the tracker.
    const reqs = subIssues(HUB, o.number).filter((r) => r.labels.some((l) => l.name === 'requirement') && r.state_reason !== 'not_planned');
    const byStatus = {};
    for (const r of reqs) { const s = statusOf(r.labels); byStatus[s] = (byStatus[s] || 0) + 1; }
    const short = o.title.replace(/^(Objective|Goal):\s*/i, '').split(' — ')[0].trim();
    objectives.push({ number: o.number, short, state: o.state, requirements: reqs.length, byStatus });
    if (o.number === OBJECTIVE) {
      focus = { number: o.number, short, requirements: [] };
      for (const r of reqs) {
        const tasks = subIssues(HUB, r.number).map((t) => ({ repo: t.repository_url.split('/').pop(), n: t.number, title: t.title, state: t.state, reason: t.state_reason, opened: t.created_at, closed: t.closed_at }));
        focus.requirements.push({ n: r.number, title: r.title.replace(/^Requirement:\s*/, ''), status: statusOf(r.labels), state: r.state, opened: r.created_at, closed: r.closed_at, tasks });
      }
    }
  }
  const releases = PACKAGES.flatMap((repo) => gh('release', 'list', '-R', repo, '--limit', '50', '--json', 'tagName,publishedAt,isDraft,isPrerelease')
    .filter((r) => !r.isDraft && !r.isPrerelease).map((r) => ({ repo: repo.split('/')[1], tag: r.tagName, at: r.publishedAt })));
  const data = { source: `${HUB} sub-issues and the GitHub releases of ${PACKAGES.join(', ')}, read with the gh CLI`, readAt: new Date().toISOString(), objectives, focus, releases };
  await fs.writeFile(DATA, JSON.stringify(data, null, 1) + '\n');
  console.log(`plan-timeline: ${objectives.length} objectives, ${focus.requirements.length} requirements under #${OBJECTIVE}, ${focus.requirements.reduce((t, r) => t + r.tasks.length, 0)} tasks, ${releases.length} releases; wrote plan-timeline.json`);
}

// ---------------------------------------------------------------- the markup
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ET = 'America/New_York';
const inET = (d, opts) => new Intl.DateTimeFormat('en-GB', { timeZone: ET, ...opts }).format(d);
const pct = (x) => `${Math.round(x * 10000) / 100}%`;
const STATUS_ORDER = ['released', 'review', 'in session', 'ready', 'backlog', 'none'];
const STATUS_COLOR = { released: '#86efac', review: '#6c3270', 'in session': '#a367a4', ready: '#d3aed3', backlog: '#efe4ef', none: '#fca5a5' };

function build(D) {
  const F = D.focus;
  // The axis: from 06:00 Eastern on the day the objective's requirements were filed to 20:00
  // Eastern on the day the last one closed. Eastern is UTC-4 throughout (daylight time).
  const ms = (s) => Date.parse(s);
  const first = Math.min(...F.requirements.map((r) => ms(r.opened)));
  const last = Math.max(...F.requirements.filter((r) => r.closed).map((r) => ms(r.closed)));
  const day0 = Date.parse(`${inET(first, { year: 'numeric' })}-${inET(first, { month: '2-digit' })}-${inET(first, { day: '2-digit' })}T00:00:00-04:00`);
  const T0 = day0 + 6 * 3600e3;
  const dayN = Date.parse(`${inET(last, { year: 'numeric' })}-${inET(last, { month: '2-digit' })}-${inET(last, { day: '2-digit' })}T00:00:00-04:00`);
  const T1 = dayN + 20 * 3600e3;
  const X = (t) => (Math.min(Math.max(t, T0), T1) - T0) / (T1 - T0);

  // Rows: closed requirements in the order they closed, open ones last.
  const reqs = [...F.requirements].sort((a, b) => (a.closed ? ms(a.closed) : Infinity) - (b.closed ? ms(b.closed) : Infinity) || ms(a.opened) - ms(b.opened));
  const nReq = reqs.length, nTask = reqs.reduce((t, r) => t + r.tasks.length, 0);
  const doneReq = reqs.filter((r) => r.state === 'closed').length;
  const doneTask = reqs.reduce((t, r) => t + r.tasks.filter((k) => k.state === 'closed').length, 0);
  const rows = reqs.map((r) => {
    const tasks = [...r.tasks].sort((a, b) => (a.closed ? ms(a.closed) : Infinity) - (b.closed ? ms(b.closed) : Infinity));
    const beads = tasks.map((k) => `<i data-f="${k.opened}"${k.closed ? ` data-c="${k.closed}"` : ''}${k.closed ? '' : ' class="open"'} title="${esc(`${k.repo}#${k.n}`)}"></i>`).join('');
    const x0 = X(ms(r.opened)), x1 = r.closed ? X(ms(r.closed)) : 1;
    const name = SHORT[r.n] || r.title.split(/[:,—]/)[0];
    return `<div class="rq${r.closed ? '' : ' open'}" data-f="${r.opened}"${r.closed ? ` data-c="${r.closed}"` : ''}>`
      + `<span class="t" title="${esc(`#${r.n} ${r.title}`)}">${esc(name)}</span><span class="bd">${beads}</span>`
      + `<span class="ln"><b style="left:${pct(x0)};width:${pct(Math.max(x1 - x0, 0))}"></b></span></div>`;
  }).join('\n          ');

  // Day ticks (midnight Eastern) and day names centred on each day's visible part.
  let ticks = '', days = '';
  for (let d = day0; d < T1; d += 86400e3) {
    const a = Math.max(d, T0), b = Math.min(d + 86400e3, T1);
    if (d > T0) ticks += `<s style="left:${pct(X(d))}"></s>`;
    days += `<span data-a="${new Date(a).toISOString()}" data-b="${new Date(b).toISOString()}" style="left:${pct((X(a) + X(b)) / 2)}">${inET(d + 12 * 3600e3, { weekday: 'short' })} ${inET(d + 12 * 3600e3, { day: 'numeric' })}</span>`;
  }
  // The weekend band, Friday 06:00 to Monday 00:00: the weekend slide 40 is about.
  const wk = `<em class="wk" style="left:0;width:${pct(X(day0 + 3 * 86400e3))}"><span>One weekend, 2–4 October</span></em>`;
  // Releases: one marker a version, at the first of the two packages' release times.
  const byTag = {};
  for (const r of D.releases) (byTag[r.tag] ||= []).push(r);
  const rels = Object.entries(byTag).sort((a, b) => Math.min(...a[1].map((r) => ms(r.at))) - Math.min(...b[1].map((r) => ms(r.at)))).map(([tag, rs]) => {
    const at = Math.min(...rs.map((r) => ms(r.at)));
    const who = rs.map((r) => `${r.repo} ${inET(ms(r.at), { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })} Eastern`).join('; ');
    return `<span class="rl" data-f="${new Date(at).toISOString()}" style="left:${pct(X(at))}" title="${esc(who)}"><i></i>${esc(tag)}</span>`;
  }).join('');

  // The sidebar: every objective, its requirements' statuses as a bar.
  const goals = D.objectives.map((o) => {
    const segs = STATUS_ORDER.filter((s) => o.byStatus[s]).map((s) => `<i class="k-${s.replace(' ', '-')}" style="width:${pct(o.byStatus[s] / Math.max(o.requirements, 1))}"></i>`).join('');
    const done = o.byStatus.released || 0, me = o.number === F.number;
    return `<li${me ? ' class="me"' : ''}><span class="g">${esc(goalName(o))}</span><span class="c">${me ? `<b data-k="greq">${done}</b>/<b data-k="gtot">${o.requirements}</b>` : `${done}/${o.requirements}`}</span><span class="br">${segs}</span></li>`;
  }).join('\n            ');

  const read = new Date(D.readAt);
  const readOn = inET(read, { day: 'numeric', month: 'long', year: 'numeric' });
  const readShort = inET(read, { day: 'numeric', month: 'short', year: 'numeric' });
  const html = `
      <div class="plan" data-t0="${new Date(T0).toISOString()}" data-t1="${new Date(T1).toISOString()}">
        <div class="one">
          <p class="lab"><span>One goal · ${esc(F.short)}</span><span class="cnt"><b data-k="req">${doneReq}</b> of <b data-k="rtot">${nReq}</b> requirements done · <b data-k="task">${doneTask}</b> of <b data-k="ttot">${nTask}</b> tasks</span></p>
          <div class="gant" style="grid-template-rows: repeat(${nReq}, 1fr) auto auto">
          ${rows}
          <div class="ax rel"><span class="t">Releases · bio.viz and gsm.bio</span><span class="ln">${rels}</span></div>
          <div class="ax day"><span class="t"></span><span class="ln">${ticks}${days}</span></div>
          <div class="ov" style="grid-row: 1 / ${nReq + 1}">${wk}</div>
          <div class="ov" style="grid-row: 1 / ${nReq + 2}"><u class="ph"></u></div>
          </div>
        </div>
        <aside class="all">
          <p class="lab">Every goal · ${D.objectives.length}</p>
          <ul>
            ${goals}
          </ul>
        </aside>
      </div>
      <p class="leg2"><span><i style="background:#86efac"></i>Done · released</span><span><i style="background:#6c3270"></i>In review</span><span><i style="background:#d3aed3"></i>Ready</span><span><i style="background:#efe4ef"></i>Open · backlog</span><span><i class="hx"></i>Release</span><span class="st2">obot.roadmap · GitHub releases · ${readShort}</span></p>
      `;
  return { html, counts: { nReq, nTask, doneReq, doneTask, T0: new Date(T0).toISOString(), T1: new Date(T1).toISOString(), readOn } };
}

if (args.includes('--fetch')) await fetchAll();
const targets = values('inject');
if (targets.length || !args.includes('--fetch')) {
  const D = JSON.parse(await fs.readFile(DATA, 'utf8'));
  const { html, counts } = build(D);
  console.log('plan-timeline:', JSON.stringify(counts));
  for (const t of targets) {
    const file = path.resolve(process.cwd(), t);
    const src = await fs.readFile(file, 'utf8');
    const re = /(<!-- roadmap-tree:plan-timeline:start -->)[\s\S]*?(<!-- roadmap-tree:plan-timeline:end -->)/;
    if (!re.test(src)) throw new Error(`plan-timeline: no roadmap-tree:plan-timeline markers in ${t}`);
    await fs.writeFile(file, src.replace(re, (_, a, b) => `${a}${html}${b}`));
    console.log(`plan-timeline: injected into ${t}`);
  }
}
