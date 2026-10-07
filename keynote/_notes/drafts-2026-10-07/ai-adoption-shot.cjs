// Screenshot each candidate: the 560 x 300 visual on its own (at 2x) and on its stand-in slide (1600 x 900),
// and report layout facts: text under 22px, text outside the 560 x 300 box, text overlapping text or bars.
const { createRequire } = require('module');
const req = createRequire('/Users/jwildfire/Documents/obot2/safety.viz/');
const { chromium } = req('playwright');
const OUT = '/Users/jwildfire/Documents/github/jwildfire.github.io/.claude/worktrees/keynote-deck/keynote/_notes/drafts-2026-10-07/';
(async () => {
  const browser = await chromium.launch();
  for (const [n, id, name] of [[1, 'aiv-a', 'a'], [2, 'aiv-b', 'b'], [3, 'aiv-c', 'c']]) {
    for (const scale of [1, 2]) {
      const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: scale });
      await page.goto('file://' + OUT + 'ai-adoption-visual.html#' + n);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      if (scale === 1) {
        const facts = await page.evaluate(id => {
          const box = document.getElementById(id), br = box.getBoundingClientRect();
          const out = { box: [Math.round(br.left), Math.round(br.top), Math.round(br.width), Math.round(br.height)], fonts: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))], small: [], outside: [], overlap: [], on_bar: [] };
          const texts = [...box.querySelectorAll('svg text')].map(t => ({ t: t.textContent, cls: t.getAttribute('class'), r: t.getBoundingClientRect(), fs: parseFloat(getComputedStyle(t).fontSize) }));
          const rects = [...box.querySelectorAll('svg rect')].map(r => r.getBoundingClientRect());
          for (const x of texts) {
            if (x.fs < 22) out.small.push([x.t, x.fs]);
            if (x.r.left < br.left - 0.5 || x.r.right > br.right + 0.5 || x.r.top < br.top - 0.5 || x.r.bottom > br.bottom + 0.5) out.outside.push([x.t, Math.round(x.r.left - br.left), Math.round(x.r.right - br.left), Math.round(x.r.top - br.top), Math.round(x.r.bottom - br.top)]);
            if (x.cls !== 'in') for (const r of rects) if (x.r.left < r.right - 1 && r.left < x.r.right - 1 && x.r.top + 5 < r.bottom && r.top < x.r.bottom - 5) { out.on_bar.push(x.t); break; }
          }
          for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) { const a = texts[i].r, b = texts[j].r; if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) out.overlap.push([texts[i].t, texts[j].t]); }
          return out;
        }, id);
        console.log(name, JSON.stringify(facts));
        await page.screenshot({ path: OUT + `ai-adoption-visual-${name}-on-slide.png` });
      } else {
        await page.locator('#' + id).screenshot({ path: OUT + `ai-adoption-visual-${name}.png` });
      }
      await page.close();
    }
  }
  await browser.close();
})();
