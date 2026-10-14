// Screenshot both options at 1600x900 and report layout facts (overflow, smallest text).
const { createRequire } = require('module');
const req = createRequire('/Users/jwildfire/Documents/obot2/safety.viz/');
const { chromium } = req('playwright');
const OUT = '/Users/jwildfire/Documents/github/jwildfire.github.io/.claude/worktrees/keynote-deck/keynote/_notes/drafts-2026-10-07/';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  for (const [n, file] of [[1, 'slide25-activity.png'], [2, 'slide25-activity-option-b.png']]) {
    await page.goto('file://' + OUT + 'slide25-activity.html#' + n);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const facts = await page.evaluate(() => {
      const s = document.querySelector('.slide.active');
      const sr = s.getBoundingClientRect();
      const out = { fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i), small: [], outside: [], svg: [] };
      for (const svg of s.querySelectorAll('svg')) { const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; out.svg.push({ w: Math.round(r.width), h: Math.round(r.height), vb: vb.width + 'x' + vb.height, scale: Math.min(r.width / vb.width, r.height / vb.height).toFixed(3) }); }
      const bottomLimit = sr.bottom - 110, rightLimit = sr.right - 140, leftLimit = sr.left + 140;
      for (const el of s.querySelectorAll('p, h2, div.big, text, li')) {
        if (el.closest('.notes')) continue;
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        let fs = parseFloat(getComputedStyle(el).fontSize);
        const svg = el.closest('svg');
        if (svg) { const sr2 = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; fs *= Math.min(sr2.width / vb.width, sr2.height / vb.height); }
        const t = el.textContent.trim().slice(0, 40);
        if (fs < 22) out.small.push([t, fs.toFixed(1)]);
        if (r.bottom > bottomLimit + 1 || r.right > rightLimit + 1 || r.left < leftLimit - 1) out.outside.push([t, Math.round(r.left), Math.round(r.right), Math.round(r.bottom)]);
      }
      // text-on-text overlap inside each svg
      const texts = [...s.querySelectorAll('svg text')].map(t => ({ t: t.textContent, r: t.getBoundingClientRect() }));
      out.overlap = [];
      for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) { const a = texts[i].r, b = texts[j].r; if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) out.overlap.push([texts[i].t, texts[j].t]); }
      return out;
    });
    console.log(file, JSON.stringify(facts));
    await page.screenshot({ path: OUT + file });
  }
  await browser.close();
})();
