// Records the bio.viz tail for the keynote's safety.viz demo clip (slide 43).
// Same app, same four pilot files, R already running from RBQM; then
// Biomarkers -> Correlation matrix -> click ALT x AST -> association scatter.
// Needs pilot/{adsl,adae,adbds,adeg}.csv beside it (safety.viz site/data on main).
// Writes PNG frames + a concat list to seq/; ffmpeg turns them into the tail, which is
// joined onto the 40-second clip (see the slide notes, 2026-10-20).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire('/Users/jwildfire/Documents/obot2/safety.viz/');
const { chromium } = require('playwright');

const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(DIR, 'seq');
const HEX = '/Users/jwildfire/Documents/github/jwildfire.github.io/.claude/worktrees/keynote-deck/keynote/assets/hex/orange-inspector.png';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
page.setDefaultTimeout(120000);
await page.goto('https://jwildfire.github.io/safety.viz/demo/');
await page.waitForLoadState('networkidle');

// Load the four files the way a user does
await page.getByRole('button', { name: /^Data/ }).first().click();
const [chooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByRole('button', { name: /choose files/i }).first().click(),
]);
await chooser.setFiles(['adsl', 'adae', 'adbds', 'adeg'].map(f => path.join(DIR, 'pilot', f + '.csv')));
await page.getByText(/your 4 files/i).first().waitFor();

// RBQM, start R, AE metric (where the existing clip ends)
await page.getByRole('button', { name: /^RBQM/ }).first().click();
await page.getByRole('button', { name: /^start r$/i }).first().click();
await page.getByText(/r ready/i).first().waitFor({ timeout: 240000 });
// bio.viz statistics need their own R start; do it off-camera, then go back
await page.getByRole('button', { name: /^Biomarkers/ }).first().click();
await page.getByRole('button', { name: /^Correlation matrix/ }).first().click();
await page.waitForTimeout(1500);
await page.locator('button:visible', { hasText: /^start r$/i }).first().click();
await page.locator('button.bv-cell:has-text("0.65")').first().waitFor({ timeout: 240000 });
await page.getByRole('button', { name: /^Group comparison/ }).first().click();
await page.waitForTimeout(1500);
await page.getByRole('button', { name: /^RBQM/ }).first().click();
await page.waitForTimeout(2000);
await page.evaluate(() => {
  const el = [...document.querySelectorAll('body *')].find(e => e.textContent.trim() === 'AE' && e.getBoundingClientRect().top < 80 && e.getBoundingClientRect().top > 40);
  (el.closest('button,a,[role],[tabindex]') || el).click();
});
await page.waitForTimeout(4000);

// Overlay: pointer, highlight ring, Orange's note
const hexData = 'data:image/png;base64,' + fs.readFileSync(HEX).toString('base64');
await page.addStyleTag({ content: `
  #kx-cursor{position:fixed;left:0;top:0;width:26px;height:38px;z-index:2147483647;pointer-events:none;transform-origin:2px 2px}
  #kx-ring{position:fixed;z-index:2147483646;pointer-events:none;border:3px solid #5b8f6c;border-radius:12px;
    box-shadow:0 0 0 6px rgba(91,143,108,.16);background:rgba(91,143,108,.07);opacity:0;transition:none}
  #kx-note{position:fixed;right:40px;bottom:150px;z-index:2147483646;pointer-events:none;display:flex;align-items:center;opacity:0}
  #kx-note .b{position:relative;background:#eef4ee;border:3px solid #5b8f6c;border-radius:26px;padding:20px 30px 20px 30px;
    box-shadow:0 10px 30px rgba(31,35,40,.14);margin-right:20px}
  #kx-note .b:after{content:"";position:absolute;right:-17px;top:50%;width:26px;height:26px;background:#eef4ee;
    border-right:3px solid #5b8f6c;border-top:3px solid #5b8f6c;transform:translateY(-50%) rotate(45deg);border-radius:0 6px 0 0}
  #kx-note .k{font:500 19px/1.2 "IBM Plex Mono",monospace;letter-spacing:.2em;color:#3d4a42;text-transform:uppercase;margin-bottom:6px}
  #kx-note .t{font:400 48px/1.05 "Instrument Serif",serif;color:#1f2328;white-space:nowrap}
  #kx-note img{width:132px;height:auto;filter:drop-shadow(0 8px 14px rgba(31,35,40,.25))}
`});
await page.evaluate((hex) => {
  const c = document.createElement('div'); c.id = 'kx-cursor';
  c.innerHTML = '<svg viewBox="0 0 26 38" width="26" height="38"><path d="M2 2 L2 30 L9 23.5 L14 35 L19 33 L14 21.5 L23.5 21.5 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
  const r = document.createElement('div'); r.id = 'kx-ring';
  const n = document.createElement('div'); n.id = 'kx-note';
  n.innerHTML = `<div class="b"><div class="k"></div><div class="t"></div></div><img src="${hex}">`;
  document.body.append(c, r, n);
}, hexData);

// Frame bookkeeping: every frame is a screenshot held for a duration
const list = [];
let i = 0, cur = { x: 1180, y: 760 };
async function shot(sec) {
  const f = `f${String(i++).padStart(4, '0')}.png`;
  await page.screenshot({ path: path.join(OUT, f) });
  list.push({ f, sec });
}
const setCursor = (p, s = 1) => page.evaluate(({ x, y, s }) => {
  document.getElementById('kx-cursor').style.transform = `translate(${x}px,${y}px) scale(${s})`;
}, { ...p, s });
async function move(to, sec = 0.6) {
  const n = Math.max(8, Math.round(sec * 15)), from = { ...cur };
  for (let k = 1; k <= n; k++) {
    const t = k / n, e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    cur = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
    await setCursor(cur); await shot(1 / 15);
  }
}
async function click(locator, settle = 1.0) {
  await setCursor(cur, 0.85); await shot(0.1); await setCursor(cur, 1);
  await locator.click();
  await page.waitForTimeout(settle * 1000);
}
const centre = async (loc) => { const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
async function ring(loc, pad = 8) {
  const b = loc ? await loc.boundingBox() : null;
  await page.evaluate(({ b, pad }) => {
    const r = document.getElementById('kx-ring');
    if (!b) { r.style.opacity = 0; return; }
    Object.assign(r.style, { left: b.x - pad + 'px', top: b.y - pad + 'px', width: b.width + 2 * pad + 'px', height: b.height + 2 * pad + 'px', opacity: 1 });
  }, { b, pad });
}
async function note(kicker, title, pos) {
  await page.evaluate(({ kicker, title, pos }) => {
    const n = document.getElementById('kx-note');
    n.querySelector('.k').textContent = kicker; n.querySelector('.t').textContent = title;
    Object.assign(n.style, { right: '40px', bottom: '150px', top: 'auto' }, pos || {});
  }, { kicker, title, pos });
  for (const [o, y] of [[.25, 18], [.55, 10], [.8, 4], [1, 0]]) {
    await page.evaluate(({ o, y }) => { const n = document.getElementById('kx-note'); n.style.opacity = o; n.style.transform = `translateY(${y}px)`; }, { o, y });
    await shot(1 / 30);
  }
}
async function hideNote() { await page.evaluate(() => { document.getElementById('kx-note').style.opacity = 0; }); }

// --- the take ---
await page.mouse.move(1599, 899);
await setCursor(cur);
await shot(0.8);                                                   // RBQM AE, where the clip left off
const bio = page.getByRole('button', { name: /^Biomarkers/ }).first();
await move(await centre(bio), 0.7);
await click(bio, 1.5);
await shot(0.6);                                                   // bio.viz charts in the same app
const cm = page.getByRole('button', { name: /^Correlation matrix/ }).first();
await move(await centre(cm), 0.6);
await click(cm, 0.4);
await page.locator("button.bv-cell:has-text(\"0.65\")").first().waitFor();
await page.waitForTimeout(2500);
await page.mouse.move(1599, 899);
await shot(0.5);
await note('bio.viz · correlation matrix', 'Every biomarker against every other', { bottom: '60px' });
await shot(1.6);
const cell = page.locator('button.bv-cell[aria-label^="Alanine Aminotransferase and Aspartate Aminotransferase"]').first();
await move(await centre(cell), 0.7);
await ring(cell, 6);
await shot(0.9);
await hideNote(); await ring(null);
await click(cell, 0.4);
await page.getByRole('button', { name: /back to the correlation matrix/i }).waitFor();
await page.waitForTimeout(1500);
await page.mouse.move(1599, 899);
await move({ x: cur.x + 260, y: cur.y + 160 }, 0.5);
await shot(0.4);
await note('click a cell', 'The scatter behind the number', { bottom: '60px' });
await shot(3.2);

fs.writeFileSync(path.join(OUT, 'list.txt'),
  list.map(({ f, sec }) => `file '${f}'\nduration ${sec.toFixed(4)}`).join('\n') + `\nfile '${list.at(-1).f}'\n`);
console.log('frames', list.length, 'seconds', list.reduce((a, b) => a + b.sec, 0).toFixed(2));
await browser.close();
