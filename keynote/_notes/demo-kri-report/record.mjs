// record.mjs — records the looping video of the gsm KRI site report for slide 12.
//
//   node record.mjs
//
// It opens the public example report as served, drives it with a real mouse at a
// human pace and records the page. Nothing in the report is changed. Two things
// are drawn over the page by this script, because a recorded page shows no
// pointer: a cursor arrow that follows the real mouse, and a ring on each press.
//
// The page is shown at a browser zoom of about 114% (a 1408x792 window drawn on
// 1600x900 pixels) so its small text reads on a shared screen. Playwright's own
// video ignores that zoom, so the .mp4 is not made from its .webm: it is made
// from full-size screenshots of the same page, taken one after another while the
// run goes on (about 24 a second), and laid on a steady 25 frames a second.
// The .webm is kept beside this file as the plain record of the same run.
// README.md says what else differs from a hand-run.

import { createRequire } from 'module';
import { execFileSync, spawn } from 'child_process';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// ---- paths and settings ------------------------------------------------------

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Playwright is borrowed from the safety.viz clone; nothing there is written to.
const PLAYWRIGHT_FROM = '/Users/jwildfire/Documents/obot2/safety.viz/';
// The report, as published by the gsm.kri package's own site. Read only.
const REPORT_URL = 'https://gilead-public.github.io/gsm.kri/examples/Example_SiteReport.html';
const NAME = 'gsm-kri-report-demo';
const ASSETS = path.resolve(HERE, '../../assets'); // keynote/assets
const OUT = { width: 1600, height: 900 }; // the video, in pixels
// The window the page believes it has. 1408 is the narrowest 16:9 window with
// even sides in which the report's 960-pixel charts fit beside its contents list.
const WINDOW = { width: 1408, height: 792 };
const ZOOM = OUT.width / WINDOW.width;
const FPS = 25;
const CRF = 20; // H.264 quality; raise it to make the file smaller
const FFMPEG = '/opt/homebrew/bin/ffmpeg';
const FFPROBE = '/opt/homebrew/bin/ffprobe';
// The full-size screenshots (about 150 KB each, a few thousand of them) go here
// and are removed once the .mp4 is made.
const CAPTURE_DIR = process.env.KRI_CAPTURE_DIR || path.join(os.tmpdir(), `${NAME}-capture`);

// The site followed through the report, and the metric opened.
const SITE = '0X1748';
const METRIC = 'Adverse Event Rate';
// Where the pointer rests at the start and the end: the empty right margin.
const REST = { x: 1320, y: 210 };
// How long each state is held, in milliseconds.
const HOLD = { short: 900, beat: 1900, read: 2500, long: 3000 };

// ---- helpers -------------------------------------------------------------------

const require = createRequire(PLAYWRIGHT_FROM);
const { chromium } = require('playwright');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const expect = (condition, message) => {
  if (!condition) throw new Error(`Check failed: ${message}`);
};

// Drawn over the page: the cursor and the press ring. Both sit outside the
// report's own elements and take no pointer events.
const OVERLAY = () => {
  const cursor = document.createElement('div');
  cursor.id = 'demo-cursor';
  cursor.style.cssText =
    'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;' +
    'transform:translate(-200px,-200px);will-change:transform';
  cursor.innerHTML =
    '<svg width="26" height="33" viewBox="0 0 20 26" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">' +
    '<path d="M1 1 L1 19.5 L5.8 15.2 L9.2 23 L12.6 21.5 L9.3 13.9 L15.8 13.9 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  document.documentElement.appendChild(cursor);
  const style = document.createElement('style');
  style.textContent =
    '@keyframes demo-ring{from{transform:translate(-50%,-50%) scale(.3);opacity:.9}to{transform:translate(-50%,-50%) scale(1);opacity:0}}' +
    '.demo-ring{position:fixed;z-index:2147483646;pointer-events:none;width:50px;height:50px;border-radius:50%;' +
    'border:4px solid #6d3fc4;background:rgba(109,63,196,.18);animation:demo-ring .55s ease-out forwards}';
  document.documentElement.appendChild(style);
  window.__demoRing = (x, y) => {
    const ring = document.createElement('div');
    ring.className = 'demo-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    document.documentElement.appendChild(ring);
    setTimeout(() => ring.remove(), 700);
  };
  window.addEventListener(
    'mousemove',
    (event) => {
      cursor.style.transform = `translate(${event.clientX}px,${event.clientY}px)`;
    },
    true
  );
  window.addEventListener('mousedown', (event) => window.__demoRing(event.clientX, event.clientY), true);
};

// ---- the run -------------------------------------------------------------------

const stepsDir = path.join(HERE, 'steps');
const framesDir = path.join(HERE, 'frames');
const rawDir = path.join(HERE, '.raw');
for (const dir of [stepsDir, framesDir, rawDir, CAPTURE_DIR]) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
mkdirSync(ASSETS, { recursive: true });
rmSync(path.join(HERE, '.failure.png'), { force: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: WINDOW,
  deviceScaleFactor: ZOOM,
  serviceWorkers: 'block',
  recordVideo: { dir: rawDir, size: WINDOW }
});

const requests = [];
const failed = [];
const consoleMessages = [];
const pageErrors = [];
context.on('request', (request) => requests.push(request.url()));
context.on('requestfailed', (request) =>
  failed.push({ url: request.url(), error: request.failure() && request.failure().errorText })
);

const page = await context.newPage();
const opened = Date.now();
page.on('console', (message) =>
  consoleMessages.push({ t: (Date.now() - opened) / 1000, type: message.type(), text: message.text() })
);
page.on('pageerror', (error) => pageErrors.push({ t: (Date.now() - opened) / 1000, message: error.message }));

// -- the camera: full-size screenshots, one after another, each with its time --
// Playwright's own screenshot is used, with nothing hidden and nothing paused. (A
// second DevTools session is faster, but it returns the unzoomed size unless it
// is given the zoom too, and then the mouse lands in the wrong place.)
const SHOT = { type: 'png', scale: 'device', caret: 'initial', animations: 'allow' };
const shots = []; // { t, file }
const writes = [];
let filming = false;
let filmed = Promise.resolve();
let t0 = 0; // the video's zero
let latest = null; // the newest screenshot's bytes
let onShot = [];
let paused = false; // true while a scroll takes its own screenshots
let inFlight = Promise.resolve();
let skew = 0; // milliseconds of real time that are not in the video (see wheel)
const now = () => (Date.now() - t0 - skew) / 1000;
function keep(t, png) {
  const file = path.join(CAPTURE_DIR, `shot-${String(shots.length).padStart(5, '0')}.png`);
  latest = png;
  shots.push({ t, file });
  writes.push(writeFile(file, png));
  const waiting = onShot;
  onShot = [];
  for (const resolve of waiting) resolve(png);
}
async function film() {
  while (filming) {
    if (paused) {
      await sleep(4);
      continue;
    }
    const t = now();
    inFlight = page.screenshot(SHOT);
    keep(t, await inFlight);
  }
}
const nextShot = () => new Promise((resolve) => onShot.push(resolve));
// Two animation frames: long enough for the page to have drawn what it was told.
const settle = () => page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));

// -- the mouse: every move is a real mouse move, eased, at about 60 a second --
let at = { ...REST };
async function moveTo(x, y, ms = 800) {
  const from = { ...at };
  const steps = Math.max(2, Math.round(ms / 16));
  const start = Date.now();
  for (let i = 1; i <= steps; i += 1) {
    const k = ease(i / steps);
    await page.mouse.move(from.x + (x - from.x) * k, from.y + (y - from.y) * k);
    const due = start + (ms * i) / steps;
    if (due > Date.now()) await sleep(due - Date.now());
  }
  at = { x, y };
}
async function centre(locator, { dx = 0, dy = 0 } = {}) {
  const box = await locator.boundingBox();
  if (!box) throw new Error(`Not on the page: ${locator}`);
  return { x: box.x + box.width / 2 + dx, y: box.y + box.height / 2 + dy, box };
}
async function moveOver(locator, { ms = 800, ...offset } = {}) {
  const { x, y } = await centre(locator, offset);
  await moveTo(x, y, ms);
}
async function press() {
  await sleep(250);
  await page.mouse.down();
  await sleep(80);
  await page.mouse.up();
}
async function click(locator, options) {
  await moveOver(locator, options);
  await press();
}
// A wheel scroll, eased, one real wheel event for each frame of the video.
//
// A screenshot taken while a scroll is still on its way shows the report's
// fixed parts (its contents list and "Select Group" box) knocked out of place by
// the distance just scrolled; a screen does not show that. So during a scroll
// the camera stops running by itself: each wheel event is followed by a wait
// for the page to draw, then one screenshot, placed a twenty-fifth of a second
// after the one before. That takes about 60 ms a frame rather than 40, and the
// difference is taken off the video's clock.
async function wheel(dy, ms = 900) {
  paused = true;
  await inFlight;
  const frames = Math.max(2, Math.round((ms * FPS) / 1000));
  const from = now();
  const began = Date.now();
  let done = 0;
  for (let i = 1; i <= frames; i += 1) {
    const target = Math.round(dy * ease(i / frames));
    await page.mouse.wheel(0, target - done);
    done = target;
    await settle();
    keep(from + i / FPS, await page.screenshot(SHOT));
  }
  skew += Date.now() - began - (frames * 1000) / FPS;
  paused = false;
  await sleep(200);
}
// Scroll so an element's top sits at a given height in the window.
async function bringTo(locator, y, ms) {
  const box = await locator.boundingBox();
  if (box && Math.abs(box.y - y) > 2) await wheel(box.y - y, ms);
}
const scrollTop = async (ms) => {
  for (let tries = 0; tries < 8; tries += 1) {
    const y = await page.evaluate(() => window.scrollY);
    if (y <= 0) return;
    await wheel(-y, tries ? 300 : ms);
  }
  throw new Error('The page did not scroll back to the top.');
};

// -- the record: each step with its time in the video, and the frame it names --
const steps = [];
async function mark(name, note, facts = {}) {
  const index = String(steps.length + 1).padStart(2, '0');
  const file = `${index}-${name}.png`;
  const t = now();
  writeFileSync(path.join(stepsDir, file), await nextShot());
  steps.push({ video: Number(t.toFixed(2)), name, note, screenshot: `steps/${file}`, ...facts });
  console.log(`  ${t.toFixed(1).padStart(6)}s  ${name}: ${note}`);
}
const textOf = async (selector) => ((await page.locator(selector).first().textContent()) || '').replace(/\s+/g, ' ').trim();

// The report's own controls and charts.
const overall = page.locator('#overall-group-select select'); // "Select Group", fixed top right
const overview = page.locator('table.group-overview');
const siteRow = overview.locator('tbody tr').filter({ hasText: `${SITE} (` });
const metricHeading = page.locator('h3', { hasText: new RegExp(`^\\s*${METRIC}\\s*$`) });
const section = page.locator('#summary-charts-1'); // the tab set under that heading
const tab = (name) => section.locator('.nav-tabs a', { hasText: name });
// Click a tab, then draw the pointer off it into the empty strip right of the
// tabs, so the tab's name can be read.
async function openTab(name, ms) {
  await click(tab(name), { ms });
  const last = await centre(tab('Time Series'));
  await moveTo(last.box.x + last.box.width + 70, last.y + 2, 450);
}
// Every "Highlighted Site" control in every chart of the report: how many read
// each value. A chart whose metric has no result for a site keeps "None".
const highlighted = () =>
  page.evaluate(() => {
    const counts = {};
    for (const select of document.querySelectorAll('select.gsm-widget-control--group')) {
      counts[select.value] = (counts[select.value] || 0) + 1;
    }
    return counts;
  });
// A chart, read from the chart itself: where the site's point is drawn, and
// what its tooltip says when it is showing.
const chartFacts = (widget, site) =>
  page.evaluate(
    ([selector, id]) => {
      const canvas = document.querySelector(`#summary-charts-1 ${selector} canvas`);
      const chart = canvas.chart;
      const box = canvas.getBoundingClientRect();
      const points = [];
      chart.data.datasets.forEach((dataset, d) => {
        dataset.data.forEach((row, i) => {
          if (!row || row.GroupID !== id || row.y === null || row.y === undefined) return;
          const element = chart.getDatasetMeta(d).data[i];
          points.push({ x: box.x + element.x, y: box.y + element.y, score: row.Score, flag: row.Flag, date: row.SnapshotDate });
        });
      });
      const tooltip = chart.tooltip;
      return {
        visible: canvas.getClientRects().length > 0 && box.width > 0,
        drawn: chart.data.datasets.reduce((n, dataset) => n + dataset.data.length, 0),
        points,
        tooltip:
          tooltip && tooltip.opacity > 0 && tooltip.getActiveElements().length
            ? { title: (tooltip.title || []).join(' '), lines: (tooltip.body || []).flatMap((b) => b.lines) }
            : null
      };
    },
    [widget, site]
  );
// Choose from a dropdown. A native dropdown's list is not painted into a
// headless page (and, left open, swallows the next click), so the pointer goes
// to the control, a ring is drawn there, and the option is chosen with
// Playwright's selectOption, which fires the change event the report listens for.
// The pointer goes to the dropdown's arrow, so its value stays readable.
async function choose(select, value, ms = 900) {
  const { box, y } = await centre(select);
  const x = box.x + box.width - 9;
  await moveTo(x, y, ms);
  await sleep(250);
  await page.evaluate(([px, py]) => window.__demoRing(px, py), [x, y]);
  await sleep(350);
  await select.selectOption(value);
  await sleep(400);
}
// A resting place inside the "Select Group" box, just right of its dropdown:
// the box is fixed, so the pointer can stay there while the page scrolls.
async function restBeside(select, ms = 300) {
  const { box, y } = await centre(select);
  await moveTo(box.x + box.width + 13, y + 3, ms);
}

let report;
let served;
try {
  // 1. Open the report as served and wait until it has drawn.
  const response = await page.goto(REPORT_URL, { waitUntil: 'load', timeout: 120000 });
  expect(response.status() === 200, `the report is served (${response.status()})`);
  await page.waitForFunction(() => {
    const canvas = document.querySelector('.Widget_ScatterPlot canvas');
    return canvas && canvas.chart && document.querySelector('table.group-overview tbody tr');
  });
  await page.evaluate(() => document.fonts.ready);
  await sleep(2000);
  served = {
    status: response.status(),
    lastModified: response.headers()['last-modified'],
    etag: response.headers().etag
  };
  report = {
    title: await textOf('h1.title'),
    study: await textOf('h3.subtitle'),
    author: await textOf('h4.author'),
    snapshot: await textOf('h4.date'),
    status: await textOf('#report table'),
    flags: await textOf('.flag-container'),
    siteSubset: await page.locator('.Widget_GroupOverview select').evaluate((s) => s.options[s.selectedIndex].textContent),
    sitesListed: await overview.locator('tbody tr').count()
  };
  expect(report.title === 'Site KRI Overview', `the report's title (${report.title})`);
  expect(/^Snapshot Date: \d{4}-\d\d-\d\d$/.test(report.snapshot), `the snapshot date (${report.snapshot})`);
  expect((await page.evaluate(() => document.documentElement.scrollWidth)) <= WINDOW.width, 'the page fits the window');
  expect((await overall.inputValue()) === 'None', 'no site is selected when the report opens');

  await page.evaluate(OVERLAY);
  await page.mouse.move(at.x, at.y);
  await sleep(400);

  // The video starts here, on the loaded report.
  t0 = Date.now();
  filming = true;
  filmed = film();
  await mark('top', `The report as it opens: "${report.title}", ${report.study}, ${report.snapshot}.`, report);
  await sleep(HOLD.read);

  // 2. The study overview: one row per site, one column per key risk indicator.
  await bringTo(page.locator('#study-overview h2'), 14, 1500);
  await mark(
    'overview',
    `Study Overview: ${report.flags}. The table lists the ${report.sitesListed} sites with "${report.siteSubset}", a column per key risk indicator.`
  );
  await sleep(HOLD.long);

  // 3. A flagged site: the first row, red on adverse events.
  await moveOver(siteRow.locator('td').first(), { ms: 1000 });
  await sleep(HOLD.short);
  const flagCell = siteRow.locator('td.group-overview--Flag').first();
  const flagFacts = ((await flagCell.getAttribute('title')) || '').replace(/\n/g, '; ');
  const rowText = await siteRow.locator('td').evaluateAll((cells) => cells.slice(0, 5).map((cell) => cell.textContent.trim()));
  await moveOver(flagCell, { ms: 700 });
  await mark(
    'flagged-site',
    `The pointer on site ${rowText[0]}: ${rowText[2]} red flags, ${rowText[3]} amber. Its ${METRIC} flag is red (${flagFacts}).`,
    { row: rowText, flag: flagFacts }
  );
  await sleep(HOLD.beat);

  // 4. Down to that metric's own section. It opens on the scatter plot.
  await bringTo(metricHeading, 12, 2400);
  const scatter = await chartFacts('.Widget_ScatterPlot', SITE);
  expect(scatter.visible && scatter.drawn > 0 && scatter.points.length === 1, `the scatter plot drew ${SITE} (${JSON.stringify(scatter)})`);
  await mark('scatter', `${METRIC}: the scatter plot, a point per site against the flag thresholds. One point is red.`, {
    drawn: scatter.drawn
  });
  await sleep(HOLD.beat);

  // 5. Hover the red point: its tooltip names the site from the table.
  await moveTo(scatter.points[0].x, scatter.points[0].y, 1300);
  await sleep(700);
  const hovered = await chartFacts('.Widget_ScatterPlot', SITE);
  expect(hovered.tooltip && hovered.tooltip.title.includes(SITE), `the scatter tooltip names ${SITE} (${JSON.stringify(hovered.tooltip)})`);
  await mark('scatter-tooltip', `Hovering the red point: "${hovered.tooltip.title}", ${hovered.tooltip.lines.slice(0, 4).join('; ')}.`, {
    tooltip: hovered.tooltip
  });
  await sleep(HOLD.long);

  // 6. Pick that site with the report's "Select Group" control.
  await choose(overall, SITE, 1100);
  expect((await overall.inputValue()) === SITE, `Select Group reads ${SITE}`);
  const lit = await highlighted();
  const charts = Object.values(lit).reduce((sum, n) => sum + n, 0);
  expect(lit[SITE] > 0 && Object.keys(lit).every((value) => value === SITE || value === 'None'), `the charts' Highlighted Site reads ${SITE} (${JSON.stringify(lit)})`);
  await restBeside(overall);
  await sleep(500);
  const selected = await chartFacts('.Widget_ScatterPlot', SITE);
  await mark(
    'select-site',
    `"Select Group" set to ${SITE}: ${lit[SITE]} of the report's ${charts} charts now highlight that site and fade the rest.` +
      (selected.tooltip ? ' The scatter plot shows the site\'s tooltip by itself, with the pointer elsewhere.' : ''),
    { highlighted: lit, tooltip: selected.tooltip }
  );
  await sleep(HOLD.read);

  // 7. The same metric's other tabs, left to right.
  await openTab('Bar Chart', 1000);
  await section.locator('.Widget_BarChart canvas').waitFor();
  await sleep(600);
  const bars = await chartFacts('.Widget_BarChart', SITE);
  expect(bars.visible && bars.drawn > 0, `the bar chart drew (${JSON.stringify(bars)})`);
  await mark(
    'bar-chart',
    `Bar Chart: every site's score, highest first, ${SITE} highlighted.` +
      (bars.tooltip ? ` The chart shows the highlighted site's tooltip by itself ("${bars.tooltip.title}").` : ''),
    { drawn: bars.drawn, tooltip: bars.tooltip }
  );
  await sleep(HOLD.read);

  await openTab('Metric Table', 800);
  const table = section.locator('#metric-table table');
  await table.waitFor();
  await sleep(400);
  const firstRow = await table.locator('tbody tr').first().locator('td').evaluateAll((cells) => cells.map((cell) => cell.textContent.trim()));
  await mark('metric-table', `Metric Table: the flagged sites for this metric. First row: ${firstRow.slice(0, 6).join(', ')}.`, {
    rows: await table.locator('tbody tr').count()
  });
  await sleep(HOLD.read);

  await openTab('Time Series', 800);
  await section.locator('.Widget_TimeSeries canvas').waitFor();
  await sleep(600);
  const series = await chartFacts('.Widget_TimeSeries', SITE);
  expect(series.visible && series.drawn > 0 && series.points.length > 0, `the time series drew ${SITE} (${JSON.stringify(series)})`);
  const lastPoint = series.points[series.points.length - 1];
  await mark('time-series', `Time Series: the sites' scores at each snapshot, ${SITE} highlighted.`, { drawn: series.drawn });
  await sleep(HOLD.beat);
  await moveTo(lastPoint.x, lastPoint.y, 1000);
  await sleep(700);
  const seriesHover = await chartFacts('.Widget_TimeSeries', SITE);
  expect(seriesHover.tooltip && seriesHover.tooltip.title.includes(SITE), `the time series tooltip names ${SITE} (${JSON.stringify(seriesHover.tooltip)})`);
  await mark('time-series-tooltip', `Hovering the site's point: "${seriesHover.tooltip.title}", ${seriesHover.tooltip.lines.join('; ')}.`, {
    tooltip: seriesHover.tooltip
  });
  await sleep(HOLD.read);

  // 8. Back to the top, and the selection cleared, so the loop restarts where it began.
  await restBeside(overall, 1000);
  await sleep(300);
  await scrollTop(2800);
  await mark('back-to-top', 'Scrolled back to the top of the report.');
  await sleep(500);
  await choose(overall, 'None', 300);
  expect((await overall.inputValue()) === 'None' && Object.keys(await highlighted()).join() === 'None', 'the selection is cleared');
  await mark('clear', '"Select Group" set back to None.');
  await sleep(HOLD.short);
  await moveTo(REST.x, REST.y, 800);
  // The dropdown keeps the keyboard focus, and its focus ring, after a choice;
  // let go of it so the last frame matches the first.
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await sleep(1200);
  await mark('end', 'The report as it opened. The video ends here and loops.');
  await sleep(300);
} catch (error) {
  // A run that stops says where: the page as it stood, and the scroll.
  filming = false;
  await filmed;
  console.error(`  stopped at ${t0 ? now().toFixed(1) : 'load'}s, scrollY ${await page.evaluate(() => window.scrollY)}`);
  await page.screenshot({ path: path.join(HERE, '.failure.png') });
  await context.close();
  await browser.close();
  throw error;
}

filming = false;
await filmed;
const seconds = now();
await Promise.all(writes);

// The served file, fetched once more to count and hash its bytes (the browser
// does not keep 13 MB for the asking).
const again = await context.request.get(REPORT_URL);
const bytes = await again.body();
served.bytes = bytes.length;
served.sha256 = sha256(bytes);

await context.close();
await browser.close();

// ---- the files -----------------------------------------------------------------

// The .webm Playwright wrote: the same run from the moment the page was opened,
// load time included, at the window's own 1408x792 with no zoom.
const raw = readdirSync(rawDir).find((name) => name.endsWith('.webm'));
const webm = path.join(HERE, `${NAME}-raw.webm`);
renameSync(path.join(rawDir, raw), webm);
rmSync(rawDir, { recursive: true, force: true });

// The .mp4: for each frame's moment, the newest screenshot taken by then.
const size = (() => {
  const head = readFileSync(shots[0].file);
  return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
})();
expect(size.width === OUT.width && size.height === OUT.height, `the screenshots are ${OUT.width}x${OUT.height} (${size.width}x${size.height})`);
const frameCount = Math.round(seconds * FPS);
const mp4 = path.join(ASSETS, `${NAME}.mp4`);
await new Promise((resolve, reject) => {
  const ffmpeg = spawn(
    FFMPEG,
    ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF), '-pix_fmt', 'yuv420p',
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
      '-movflags', '+faststart', '-an', mp4],
    { stdio: ['pipe', 'inherit', 'inherit'] }
  );
  ffmpeg.on('error', reject);
  ffmpeg.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ended with ${code}`))));
  (async () => {
    let s = 0;
    let held = null;
    let heldIndex = -1;
    for (let k = 0; k < frameCount; k += 1) {
      while (s + 1 < shots.length && shots[s + 1].t <= k / FPS) s += 1;
      if (s !== heldIndex) {
        held = readFileSync(shots[s].file);
        heldIndex = s;
      }
      if (!ffmpeg.stdin.write(held)) await new Promise((drained) => ffmpeg.stdin.once('drain', drained));
    }
    ffmpeg.stdin.end();
  })().catch(reject);
});
const probe = (entries) =>
  execFileSync(FFPROBE, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', entries, '-of', 'csv=p=0', mp4]).toString().trim();
const duration = Number(probe('format=duration'));
const stream = probe('stream=codec_name,width,height,pix_fmt,r_frame_rate');
const audio = execFileSync(FFPROBE, ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', mp4]).toString().trim();

// The poster: the video's first frame. And a frame every five seconds to look at.
const poster = path.join(ASSETS, `${NAME}-poster.png`);
execFileSync(FFMPEG, ['-y', '-v', 'error', '-i', mp4, '-frames:v', '1', poster]);
for (let second = 0; second < duration; second += 5) {
  execFileSync(FFMPEG, ['-y', '-v', 'error', '-ss', String(second), '-i', mp4, '-frames:v', '1',
    path.join(framesDir, `frame-${String(second).padStart(3, '0')}s.png`)]);
}
// The last frame too, and whether the loop closes: the first and the last
// screenshot, compared byte for byte (the same pixels make the same PNG).
copyFileSync(shots[0].file, path.join(framesDir, 'first-shot.png'));
copyFileSync(shots[shots.length - 1].file, path.join(framesDir, 'last-shot.png'));
const loopCloses = readFileSync(shots[0].file).equals(readFileSync(shots[shots.length - 1].file));

// How steadily the screenshots came.
const gaps = shots.slice(1).map((shot, i) => shot.t - shots[i].t);
const camera = {
  screenshots: shots.length,
  perSecond: Number((shots.length / seconds).toFixed(1)),
  longestGapMs: Math.round(Math.max(...gaps) * 1000),
  gapsOver50Ms: gaps.filter((gap) => gap > 0.05).length,
  // Where the picture stood still for more than a fifth of a second: the page
  // was busy drawing and gave no screenshot until it had finished.
  stalls: gaps
    .map((gap, i) => ({ at: Number(shots[i].t.toFixed(2)), ms: Math.round(gap * 1000) }))
    .filter((stall) => stall.ms > 200)
};
rmSync(CAPTURE_DIR, { recursive: true, force: true });

// ---- what the run saw ----------------------------------------------------------

const errors = consoleMessages.filter((message) => message.type === 'error');
const mp4Bytes = readFileSync(mp4).length;
const run = {
  recorded: new Date(opened).toISOString(),
  url: REPORT_URL,
  served,
  report,
  site: SITE,
  metric: METRIC,
  window: { ...WINDOW, zoom: Number(ZOOM.toFixed(4)) },
  video: {
    mp4: path.relative(HERE, mp4),
    poster: path.relative(HERE, poster),
    seconds: duration,
    bytes: mp4Bytes,
    megabytes: Number((mp4Bytes / 1e6).toFixed(2)),
    stream,
    audioStreams: audio ? audio.split('\n').length : 0,
    frames: frameCount,
    fps: FPS,
    crf: CRF,
    rawWebm: path.basename(webm),
    loopCloses
  },
  camera,
  network: { requests, failed },
  console: { errors, pageErrors, all: consoleMessages },
  steps
};
writeFileSync(path.join(HERE, 'run.json'), `${JSON.stringify(run, null, 2)}\n`);

console.log(`  video: ${path.relative(HERE, mp4)}, ${duration.toFixed(1)}s, ${(mp4Bytes / 1e6).toFixed(2)} MB, ${stream}`);
console.log(`  camera: ${camera.screenshots} screenshots, ${camera.perSecond} a second, longest gap ${camera.longestGapMs} ms`);
console.log(`  loop closes (first screenshot equals last): ${loopCloses}`);
console.log(`  requests: ${requests.length}; failed: ${failed.length}`);
console.log(`  console errors: ${errors.length}; page errors: ${pageErrors.length}; other console lines: ${consoleMessages.length - errors.length}`);
expect(errors.length === 0 && pageErrors.length === 0, 'no console error and no page error');
expect(mp4Bytes < 8e6, `the video is under 8 MB (${(mp4Bytes / 1e6).toFixed(2)} MB)`);
