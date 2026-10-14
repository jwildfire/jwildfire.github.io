// record.mjs — records the fallback video of the keynote's live demo.
//
//   node record.mjs            both takes
//   node record.mjs pilot      take A only: the pilot study, four CSVs
//   node record.mjs renamed    take B only: the renamed-column study, three CSVs and a JSON
//
// It opens the released safety.viz single-file app from file:// with the browser
// context offline, drives it with a real mouse at a human pace and records the
// page at 1600x900. Nothing in the app is changed. Three things are drawn over
// the page by this script, because Playwright's video shows no pointer and no
// operating-system drag: a cursor arrow that follows the real mouse, a ring on
// each real mouse press, and the list of file names beside the cursor while the
// files are being dragged in. README.md says what else differs from a hand-run.

import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// ---- paths and settings ------------------------------------------------------

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Playwright is borrowed from the safety.viz clone; nothing there is written to.
const PLAYWRIGHT_FROM = '/Users/jwildfire/Documents/obot2/safety.viz/';
// The single-file app, as published at
// https://jwildfire.github.io/safety.viz/demo/safety.viz-app.html
const APP_HTML = path.join(HERE, 'input/safety.viz-app.html');
const SIZE = { width: 1600, height: 900 }; // the deck's slide size
const FFMPEG = 'ffmpeg'; // optional: the .mp4 and the 10-second frames need it
const FFPROBE = 'ffprobe';

const TAKES = {
  // Take A. The demo app's "Pilot study": standard column names, 254 pilot
  // participants plus 110 synthetic liver and kidney participants in the labs file.
  pilot: {
    files: ['adsl.csv', 'adae.csv', 'adbds.csv', 'adeg.csv'].map((name) =>
      path.join(HERE, 'input/pilot', name)
    ),
    // No row of this study needs setting by hand, so none is set.
    fixes: [],
    tile: 'Alanine Aminotransferase'
  },
  // Take B. The demo app's "Renamed columns" study: 24 pilot participants with
  // non-standard names. The hepatic charts cannot draw until two rows are set.
  renamed: {
    files: ['dm.csv', 'ae.csv', 'labs_final.csv', 'ecg.json'].map((name) =>
      path.join(HERE, 'input/renamed', name)
    ),
    fixes: [
      { kind: 'column', key: 'STNRHI', value: 'ULN' },
      { kind: 'measure', key: 'TB', value: 'Tot. Bilirubin' }
    ],
    tile: 'ALT (SGPT)'
  }
};

// How long each state is held, in milliseconds, so a speaker can say a sentence.
const HOLD = { short: 1500, beat: 3000, sentence: 4000, long: 5000 };

// ---- helpers -------------------------------------------------------------------

const require = createRequire(PLAYWRIGHT_FROM);
const { chromium } = require('playwright');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const hasFfmpeg = () => {
  try {
    execFileSync(FFMPEG, ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Drawn over the page: the cursor, the press ring and the dragged files' names.
// All three sit outside the app's own element and take no pointer events.
const OVERLAY = () => {
  const cursor = document.createElement('div');
  cursor.id = 'demo-cursor';
  cursor.style.cssText =
    'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;' +
    'transform:translate(-200px,-200px);will-change:transform';
  cursor.innerHTML =
    '<svg width="30" height="38" viewBox="0 0 20 26" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">' +
    '<path d="M1 1 L1 19.5 L5.8 15.2 L9.2 23 L12.6 21.5 L9.3 13.9 L15.8 13.9 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
    '<div id="demo-ghost" style="display:none;position:absolute;left:30px;top:26px;padding:10px 14px;border-radius:10px;' +
    'background:rgba(255,255,255,.93);border:1px solid rgba(0,0,0,.25);box-shadow:0 6px 18px rgba(0,0,0,.22);' +
    'font:500 15px/1.5 ui-monospace,Menlo,monospace;color:#222;white-space:nowrap"></div>';
  document.documentElement.appendChild(cursor);
  const style = document.createElement('style');
  style.textContent =
    '@keyframes demo-ring{from{transform:translate(-50%,-50%) scale(.3);opacity:.9}to{transform:translate(-50%,-50%) scale(1);opacity:0}}' +
    '.demo-ring{position:fixed;z-index:2147483646;pointer-events:none;width:56px;height:56px;border-radius:50%;' +
    'border:4px solid #6d3fc4;background:rgba(109,63,196,.18);animation:demo-ring .55s ease-out forwards}';
  document.documentElement.appendChild(style);
  window.addEventListener(
    'mousemove',
    (event) => {
      cursor.style.transform = `translate(${event.clientX}px,${event.clientY}px)`;
    },
    true
  );
  window.addEventListener(
    'mousedown',
    (event) => {
      const ring = document.createElement('div');
      ring.className = 'demo-ring';
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      document.documentElement.appendChild(ring);
      setTimeout(() => ring.remove(), 700);
    },
    true
  );
  window.__demoGhost = (names) => {
    const ghost = document.getElementById('demo-ghost');
    ghost.style.display = names ? 'block' : 'none';
    ghost.innerHTML = names ? names.map((name) => `<div>${name}</div>`).join('') : '';
  };
};

async function recordTake(takeName) {
  const take = TAKES[takeName];
  const stepsDir = path.join(HERE, 'steps', takeName);
  const framesDir = path.join(HERE, 'frames', takeName);
  const rawDir = path.join(HERE, `.raw-${takeName}`);
  for (const dir of [stepsDir, framesDir, rawDir]) {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
  }

  const appUrl = pathToFileURL(APP_HTML).href;
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: SIZE,
    deviceScaleFactor: 1,
    serviceWorkers: 'block',
    recordVideo: { dir: rawDir, size: SIZE }
  });
  // The claim being shown: the file runs with no network.
  await context.setOffline(true);

  const requests = [];
  const failed = [];
  const sockets = [];
  const consoleMessages = [];
  const pageErrors = [];
  context.on('request', (request) => requests.push(request.url()));
  context.on('requestfailed', (request) =>
    failed.push({ url: request.url(), error: request.failure() && request.failure().errorText })
  );

  const page = await context.newPage();
  const t0 = Date.now();
  const now = () => (Date.now() - t0) / 1000;
  page.on('websocket', (socket) => sockets.push(socket.url()));
  page.on('console', (message) =>
    consoleMessages.push({ t: now(), type: message.type(), text: message.text() })
  );
  page.on('pageerror', (error) => pageErrors.push({ t: now(), message: error.message }));

  // -- the mouse: every move is a real mouse move, eased, at about 60 a second --
  let at = { x: 30, y: 820 };
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
  // A wheel scroll in small steps, as a hand on a trackpad makes.
  async function wheel(dy, ms = 900) {
    const steps = Math.max(2, Math.round(ms / 16));
    let done = 0;
    for (let i = 1; i <= steps; i += 1) {
      const target = Math.round(dy * ease(i / steps));
      await page.mouse.wheel(0, target - done);
      done = target;
      await sleep(16);
    }
    await sleep(150);
  }
  // Scroll so an element's top sits at a given height in the window.
  async function bringTo(locator, y, ms = 900) {
    const box = await locator.boundingBox();
    if (box && Math.abs(box.y - y) > 4) await wheel(box.y - y, ms);
  }
  // Back to the top of the page. A panel under the mouse that scrolls within
  // itself takes part of a wheel scroll, so this goes on until the page is there.
  const scrollTop = async (ms = 1100) => {
    for (let tries = 0; tries < 8; tries += 1) {
      const y = await page.evaluate(() => window.scrollY);
      if (y <= 0) return;
      await wheel(-y, tries ? 300 : ms);
    }
    throw new Error('The page did not scroll back to the top.');
  };

  // -- the record: each step with its time on the clock, and a screenshot ------
  const steps = [];
  async function mark(name, note, facts = {}) {
    const index = String(steps.length + 1).padStart(2, '0');
    const file = `${index}-${name}.png`;
    const t = now();
    await page.screenshot({ path: path.join(stepsDir, file) });
    steps.push({ t, name, note, screenshot: `steps/${takeName}/${file}`, ...facts });
    console.log(`  [${takeName}] ${t.toFixed(1).padStart(6)}s  ${name}: ${note}`);
  }
  const textOf = (selector) => page.locator(selector).first().innerText();
  // As written in the page, before the stylesheet's capitals.
  const written = async (locator) => ((await locator.first().textContent()) || '').trim();
  const stepStatus = (id) => textOf(`.sva-step[data-step="${id}"] .sva-step-status`);
  const bds = (rest) => page.locator(`.sva-file[data-domain="bds"] ${rest}`);
  const expect = (condition, message) => {
    if (!condition) throw new Error(`Check failed: ${message}`);
  };
  // What the open chart has drawn, read from the charts themselves: how many
  // canvases are showing and how many data points they hold between them. A
  // chart that did not draw shows a sentence instead, and that fails the run.
  async function drawn(name) {
    const seen = await page.evaluate(() => {
      const { Chart } = window.SafetyViz.kit;
      const canvases = [...document.querySelectorAll('.sva-chart canvas')].filter(
        (canvas) => canvas.getClientRects().length && canvas.width > 0
      );
      const points = canvases
        .map((canvas) => Chart.getChart(canvas))
        .filter(Boolean)
        .reduce(
          (sum, chart) => sum + chart.data.datasets.reduce((n, dataset) => n + dataset.data.length, 0),
          0
        );
      const problem = document.querySelector('.sva-message');
      return { canvases: canvases.length, points, problem: problem && problem.textContent };
    });
    expect(!seen.problem, `${name} drew, with no message in its place (${seen.problem})`);
    expect(seen.canvases > 0 && seen.points > 0, `${name} drew its data (${JSON.stringify(seen)})`);
    return { canvases: seen.canvases, points: seen.points };
  }

  // ============================== the demo ===================================
  let version;
  let pitch;
  try {

  // 1. Open the single file from disk, offline.
  await page.goto(appUrl);
  await page.locator('.sva-drop').waitFor();
  await page.evaluate(OVERLAY);
  await page.mouse.move(at.x, at.y);
  version = await textOf('.sva-version');
  pitch = await textOf('.sva-pitch');
  expect(/^safety\.viz \d+\.\d+\.\d+$/.test(version), `the footer names a version (${version})`);
  expect(
    (await textOf('.sva-count')) === '0 of 18 charts supported by the loaded data',
    'the app opens empty'
  );
  await sleep(HOLD.short);
  await mark('open', `The single file, opened from disk with the network off. Footer: "${pitch}"`, {
    version,
    pitch
  });
  await sleep(HOLD.beat);
  await moveOver(page.locator('.sva-pitch'), { ms: 1100 });
  await sleep(HOLD.beat);

  // 2. Drop the files on the drop zone: a real drop event carrying real File
  // objects made from the files' own bytes. The operating system's drag cannot
  // be recorded, so the cursor carries the file names to the zone.
  const files = take.files.map((file) => ({
    name: path.basename(file),
    text: readFileSync(file, 'utf8'),
    type: file.endsWith('.json') ? 'application/json' : 'text/csv'
  }));
  await page.evaluate((list) => {
    const transfer = new DataTransfer();
    for (const { name, text, type } of list) transfer.items.add(new File([text], name, { type }));
    window.__demoTransfer = transfer;
  }, files);
  await moveTo(20, 640, 700);
  await page.evaluate((names) => window.__demoGhost(names), files.map((file) => file.name));
  await sleep(500);
  const zone = await centre(page.locator('.sva-drop'));
  await moveTo(zone.box.x + 120, zone.y + 10, 1100);
  const fire = (type) =>
    page.evaluate((eventType) => {
      document.querySelector('.sva-drop').dispatchEvent(
        new DragEvent(eventType, {
          dataTransfer: window.__demoTransfer,
          bubbles: true,
          cancelable: true
        })
      );
    }, type);
  await fire('dragenter');
  await fire('dragover');
  await moveTo(zone.x - 60, zone.y, 700);
  await fire('dragover');
  await sleep(700);
  await mark('drag', `Dragging ${files.length} files onto the drop zone: ${files.map((file) => file.name).join(', ')}.`);
  await page.evaluate(() => window.__demoGhost(null));
  await fire('drop');
  await page.locator('.sva-file').nth(files.length - 1).waitFor();
  await sleep(400);
  // Read back what the page says it loaded.
  const loaded = await page
    .locator('.sva-loaded-file')
    .evaluateAll((items) =>
      items.map((item) => ({
        name: item.querySelector('.sva-loaded-name').textContent,
        detail: item.querySelector('.sva-loaded-detail').textContent,
        flags: [...item.querySelectorAll('.sva-flag')].map((flag) => flag.textContent)
      }))
    );
  expect(
    files.every((file) => loaded.some((entry) => entry.name === file.name)) &&
      loaded.length === files.length,
    `every dropped file is listed as loaded (${JSON.stringify(loaded)})`
  );
  expect((await page.locator('.sva-file.sva-unplaced').count()) === 0, 'every file was placed');
  // The rows the page counted are the rows the files hold: a CSV's lines less
  // its header (no field of these files runs over a line), a JSON array's length.
  for (const file of files) {
    const held = file.name.endsWith('.json')
      ? JSON.parse(file.text).length
      : file.text.split('\n').filter((line) => line.trim()).length - 1;
    const said = loaded.find((entry) => entry.name === file.name).detail;
    expect(
      said.endsWith(`, ${held.toLocaleString('en-US')} rows`),
      `${file.name} holds ${held} rows and the page says "${said}"`
    );
  }
  const afterLoad = {
    loaded,
    mapping: await stepStatus('map'),
    charts: await stepStatus('open'),
    count: await textOf('.sva-count'),
    tabs: await page
      .locator('.sva-tab')
      .evaluateAll((tabs) => tabs.map((tab) => [...tab.children].map((part) => part.textContent).join(' ').trim()))
  };
  await mark(
    'loaded',
    `Each file is placed in a domain. Sidebar: "${afterLoad.mapping}"; "${afterLoad.charts}".`,
    afterLoad
  );
  await sleep(HOLD.sentence);
  // The tabs say how many of each domain's charts the files support.
  await moveOver(page.locator('.sva-tab[data-domain="bds"] .sva-tab-count'), { ms: 900 });
  await sleep(HOLD.short);
  await moveOver(page.locator('.sva-tab[data-domain="biomarkers"] .sva-tab-count'), { ms: 1300 });
  await sleep(HOLD.beat);

  // 3. The mapping: every guess is labelled.
  await moveOver(page.locator('.sva-step[data-step="map"] .sva-step-status'), { ms: 900 });
  await sleep(HOLD.beat);
  await click(page.locator('.sva-loaded-file[data-domain="bds"]'), { ms: 900 });
  await sleep(500);
  const labsFile = await textOf('.sva-file[data-domain="bds"] .sva-file-name');

  const tagText = (kind, key) => written(bds(`tr[data-${kind}="${key}"] .sva-tag`));
  const valueOf = (kind, key) => bds(`tr[data-${kind}="${key}"] select`).inputValue();
  // Set one row by hand. A native dropdown's list is not painted into a
  // headless page (and, left open, swallows the next click), so the row is
  // focused and the option chosen with Playwright's selectOption, which fires
  // the same change event the app listens for. The list itself is not seen.
  async function setRow({ kind, key, value }) {
    const row = `tr[data-${kind}="${key}"]`;
    await bringTo(bds(row), 430);
    await moveOver(bds(`${row} .sva-tag`), { ms: 900 });
    const before = { value: await valueOf(kind, key), tag: await tagText(kind, key) };
    await sleep(HOLD.beat);
    await moveOver(bds(`${row} select`), { ms: 800 });
    await bds(`${row} select`).focus();
    await sleep(900);
    await bds(`${row} select`).selectOption(value);
    await sleep(300);
    const after = { value: await valueOf(kind, key), tag: await tagText(kind, key) };
    expect(after.value === value && /chosen/i.test(after.tag), `${key} is set to ${value} and reads "chosen"`);
    await mark(
      `fix-${key}`,
      `Set by hand in ${labsFile}: ${key} was "${before.value || 'not mapped'}" (${before.tag}); now "${after.value}" (${after.tag}). ` +
        `Sidebar: "${await stepStatus('map')}"; "${await stepStatus('open')}".`,
      { before, after }
    );
    await sleep(HOLD.sentence);
  }

  if (take.fixes.length) {
    // Take B: a guessed row, then the rows the app would not guess, set by hand.
    await moveOver(bds('tr[data-column="USUBJID"] .sva-tag'), { ms: 900 });
    await mark(
      'guess',
      `A guessed row in ${labsFile}: Participant is "${await valueOf('column', 'USUBJID')}" (${await tagText('column', 'USUBJID')}).`
    );
    await sleep(HOLD.sentence);
    for (const fix of take.fixes) await setRow(fix);
    await moveOver(page.locator('.sva-step[data-step="open"] .sva-step-status'), { ms: 900 });
    await sleep(HOLD.beat);
  } else {
    // Take A: the four guesses are the key measures' names; all four are right.
    await bringTo(bds('tr.sva-map-section'), 300);
    const guesses = [];
    for (const key of ['ALT', 'AST', 'TB', 'ALP']) {
      guesses.push(`${key} is "${await valueOf('measure', key)}" (${await tagText('measure', key)})`);
    }
    await moveOver(bds('tr[data-measure="ALT"] .sva-tag'), { ms: 900 });
    await mark('guess', `The guessed rows in ${labsFile}: ${guesses.join('; ')}. None is wrong, so none is changed.`);
    await sleep(HOLD.sentence);
    await moveOver(bds('tr[data-measure="TB"] .sva-tag'), { ms: 900 });
    await sleep(HOLD.beat);
    await moveOver(bds('tr[data-measure="TB"] select'), { ms: 800 });
    await sleep(HOLD.beat);
  }
  await scrollTop();

  // 4. The hepatic explorer: its tab, its chip, and a participant.
  await click(page.locator('.sva-tab[data-domain="bds"]'));
  await page.locator('.sva-chart canvas:visible').first().waitFor();
  await sleep(600);
  await mark(
    'labs-tab',
    `The Labs and vitals tab opens on its first chart: ${await textOf('.sva-title')}.`,
    { drawn: await drawn('the histogram') }
  );
  await sleep(HOLD.beat);

  expect(
    (await written(page.locator('.sva-item[data-view="hep-explorer"] .sva-tag'))) === 'ready',
    'the hepatic explorer is ready'
  );
  await click(page.locator('.sva-item[data-view="hep-explorer"]'));
  await page.locator('.sva-chart canvas:visible').first().waitFor();
  await sleep(700);
  // Where the points are drawn, read from the chart itself so the mouse can be
  // put on one: the point farthest from its neighbours, among those past both
  // reference lines when there are any.
  const points = await page.evaluate(() => {
    const canvas = document.querySelector('.sva-chart canvas');
    const chart = window.SafetyViz.kit.Chart.getChart(canvas);
    const box = canvas.getBoundingClientRect();
    return chart.getDatasetMeta(0).data.map((element, index) => ({
      x: box.x + element.x,
      y: box.y + element.y,
      xUln: chart.data.datasets[0].data[index].x,
      yUln: chart.data.datasets[0].data[index].y
    }));
  });
  expect(points.length > 0, 'the hepatic explorer drew its points');
  const past = points.filter((point) => point.xUln >= 3 && point.yUln >= 2);
  const lonely = (point) =>
    Math.min(...points.filter((other) => other !== point).map((other) => Math.hypot(other.x - point.x, other.y - point.y)));
  const target = (past.length ? past : points).reduce((best, point) => (lonely(point) > lonely(best) ? point : best));
  const shown = await textOf('.sva-chart .sv-notes');
  await mark('hep-explorer', `The Hepatic Explorer draws ${points.length} participants. ${shown.split('\n')[0]}`, {
    participants: points.length,
    drawn: await drawn('the hepatic explorer')
  });
  await sleep(HOLD.sentence);

  await moveTo(target.x, target.y, 1200);
  await sleep(900);
  await mark(
    'hover',
    `Hovering a point (ALT ${target.xUln.toFixed(2)} xULN, bilirubin ${target.yUln.toFixed(2)} xULN) shows its participant.`
  );
  await sleep(HOLD.beat);
  await press();
  await page.locator('.sv-rail .sv-profile-root').waitFor();
  await sleep(700);
  const participant = await textOf('.sv-rail .sv-profile-rail-title');
  expect(/\S/.test(participant), 'the participant profile names a participant');
  expect(
    (await page.locator('.sv-rail canvas:visible').count()) > 0,
    'the participant profile drew its chart'
  );
  await mark('participant', `Clicking the point selects participant ${participant}: the visit path is drawn and the profile opens beside the chart.`, {
    participant
  });
  await sleep(HOLD.long);
  await moveOver(page.locator('.sv-rail canvas:visible').first(), { ms: 1000 });
  await sleep(HOLD.beat);
  await wheel(360, 1000);
  await mark('profile', `Further down the profile of ${participant}: each measure with its range and a sparkline.`);
  await sleep(HOLD.sentence);
  await scrollTop(900);

  // 5. The Biomarkers tab.
  await click(page.locator('.sva-tab[data-domain="biomarkers"]'));
  await page.locator('.sva-chart .bv-tile').first().waitFor();
  await sleep(700);
  const tiles = await page.locator('.sva-chart .bv-tile').count();
  expect(tiles > 0, 'the group comparison drew its tiles');
  await mark('biomarkers', `The Biomarkers tab opens on ${await textOf('.sva-title')}: ${tiles} tiles, one per biomarker, a line per arm.`, {
    tiles,
    drawn: await drawn('the group comparison')
  });
  await sleep(HOLD.long);

  await click(page.locator(`.sva-chart .bv-tile[aria-label="View ${take.tile}"]`));
  await page.locator('.sva-chart .bv-time-table').waitFor();
  await page.locator('.sva-chart canvas:visible').first().waitFor();
  await sleep(700);
  await mark(
    'biomarker-over-time',
    `A tile opens its biomarker across the visits: ${take.tile}, the arms side by side, the counts beneath.`,
    { drawn: await drawn('the biomarker over time') }
  );
  await moveTo(900, 520, 900);
  await sleep(HOLD.long);

  const visit = page.locator('.sva-chart .bv-time-visit').nth(3);
  const visitName = await written(visit);
  await click(visit);
  await page.waitForFunction(
    () => document.querySelector('.sva-chart .bv-trail').dataset.level === 'visits'
  );
  await page.locator('.sva-chart canvas:visible').first().waitFor();
  await sleep(700);
  await mark('biomarker-one-visit', `A visit opens alone: ${take.tile} at ${visitName}, a box per arm.`, {
    drawn: await drawn('the biomarker at one visit')
  });
  await moveTo(960, 480, 900);
  await sleep(HOLD.sentence);

  await click(page.locator('.sva-item[data-view="association-scatter"]'));
  await page.locator('.sva-chart canvas:visible').first().waitFor();
  await sleep(700);
  await mark('association-scatter', `A second biomarker chart: ${await textOf('.sva-title')}.`, {
    drawn: await drawn('the association scatter')
  });
  await moveTo(960, 420, 900);
  await sleep(HOLD.long);

  } catch (error) {
    // A run that stops says where: the page as it stood, and the scroll.
    console.error(`  [${takeName}] stopped at ${now().toFixed(1)}s, scrollY ${await page.evaluate(() => window.scrollY)}`);
    await page.screenshot({ path: path.join(HERE, `.failure-${takeName}.png`) });
    await context.close();
    await browser.close();
    rmSync(rawDir, { recursive: true, force: true });
    throw error;
  }

  // ============================== the close ===================================

  const finalStatus = await page
    .locator('.sva-tab')
    .evaluateAll((tabs) => tabs.map((tab) => [...tab.children].map((part) => part.textContent).join(' ').trim()));
  // The demo is over. What the run saw is kept as it stands, and then the page
  // is asked, once, for the public site, to show the network really was off:
  // online this fetch would be answered.
  const seenByTheDemo = {
    requests: [...requests],
    failed: [...failed],
    sockets: [...sockets],
    console: [...consoleMessages],
    pageErrors: [...pageErrors]
  };
  const probe = await page.evaluate(() =>
    fetch('https://jwildfire.github.io/safety.viz/', { mode: 'no-cors', cache: 'no-store' }).then(
      () => 'answered: the network was NOT off',
      (error) => `refused: ${error.message}`
    )
  );
  const probeFailure = failed.find((entry) => !seenByTheDemo.failed.includes(entry));
  const tClose = now();
  await context.close();
  const wall = now();
  await browser.close();

  // -- the video file, the mp4 beside it and a frame every ten seconds --------
  const raw = readdirSync(rawDir).find((name) => name.endsWith('.webm'));
  const webm = path.join(HERE, `demo-fallback-${takeName}.webm`);
  renameSync(path.join(rawDir, raw), webm);
  rmSync(rawDir, { recursive: true, force: true });
  let duration = null;
  let mp4 = null;
  if (hasFfmpeg()) {
    // The recorder leaves no duration in the webm's header, so the mp4 is made
    // first and measured.
    mp4 = path.join(HERE, `demo-fallback-${takeName}.mp4`);
    execFileSync(
      FFMPEG,
      ['-y', '-v', 'error', '-i', webm, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4]
    );
    duration = Number(
      execFileSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4])
        .toString()
        .trim()
    );
    for (let second = 0; second < duration; second += 10) {
      execFileSync(
        FFMPEG,
        ['-y', '-v', 'error', '-ss', String(second), '-i', mp4, '-frames:v', '1', '-q:v', '3',
          path.join(framesDir, `frame-${String(second).padStart(3, '0')}s.jpg`)]
      );
    }
  }
  // The video's clock and this script's start a fraction of a second apart and
  // end together. Times in the video are this clock's plus the gap.
  const lead = duration === null ? 0 : duration - tClose;
  for (const step of steps) step.video = Math.max(0, step.t + lead);

  // -- what the run saw ----------------------------------------------------------
  const offFile = seenByTheDemo.requests.filter((url) => url !== appUrl);
  const errors = seenByTheDemo.console.filter((message) => message.type === 'error');
  const run = {
    take: takeName,
    recorded: new Date().toISOString(),
    app: { file: path.relative(HERE, APP_HTML), sha256: sha256(APP_HTML), version, pitch, url: appUrl },
    offline: true,
    inputs: take.files.map((file) => ({ file: path.relative(HERE, file), sha256: sha256(file) })),
    video: {
      webm: path.basename(webm),
      mp4: mp4 && path.basename(mp4),
      seconds: duration,
      clockSeconds: wall,
      leadSeconds: lead,
      size: SIZE
    },
    network: {
      requests: seenByTheDemo.requests,
      requestsOtherThanTheFile: offFile,
      failed: seenByTheDemo.failed,
      webSockets: seenByTheDemo.sockets,
      offlineProbeAfterTheDemo: { result: probe, error: probeFailure && probeFailure.error }
    },
    console: { errors, pageErrors: seenByTheDemo.pageErrors, all: seenByTheDemo.console },
    finalTabs: finalStatus,
    steps
  };
  writeFileSync(path.join(HERE, `run-${takeName}.json`), `${JSON.stringify(run, null, 2)}\n`);

  console.log(`  [${takeName}] video: ${path.basename(mp4 || webm)}, ${duration === null ? '?' : duration.toFixed(1)}s`);
  console.log(`  [${takeName}] requests other than the file itself: ${offFile.length}; failed: ${seenByTheDemo.failed.length}; sockets: ${seenByTheDemo.sockets.length}`);
  console.log(`  [${takeName}] offline probe after the demo: ${probe}${probeFailure ? ` (${probeFailure.error})` : ''}`);
  console.log(`  [${takeName}] console errors: ${errors.length}; page errors: ${seenByTheDemo.pageErrors.length}; other console lines: ${seenByTheDemo.console.length - errors.length}`);
  expect(offFile.length === 0 && seenByTheDemo.sockets.length === 0, `no request but the file itself (${offFile.join(', ')})`);
  expect(probe.startsWith('refused'), `the network was off (${probe})`);
  expect(errors.length === 0 && seenByTheDemo.pageErrors.length === 0, 'no console error and no page error');
  return run;
}

// ---- run ---------------------------------------------------------------------

const wanted = process.argv[2] && process.argv[2] !== 'both' ? [process.argv[2]] : Object.keys(TAKES);
for (const name of wanted) {
  if (!TAKES[name]) throw new Error(`No take named "${name}". Takes: ${Object.keys(TAKES).join(', ')}.`);
}
if (!existsSync(APP_HTML)) throw new Error(`The single file is not at ${APP_HTML}. See README.md.`);
for (const name of wanted) {
  console.log(`Recording take "${name}"…`);
  await recordTake(name);
}
