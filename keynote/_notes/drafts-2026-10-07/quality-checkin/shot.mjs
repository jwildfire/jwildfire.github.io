import { createRequire } from 'module';
const require = createRequire('/Users/jwildfire/Documents/obot2/safety.viz/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1700, height: 1000 } });
await p.goto('file://' + process.cwd() + '/quality-checkin-mock.html'); await p.waitForTimeout(1200);
const n = await p.locator('section.slide').count();
for (let i = 0; i < n; i++) {
  const s = p.locator('section.slide').nth(i);
  const over = await s.evaluate(el => { const last = [...el.children].filter(c => getComputedStyle(c).position !== 'absolute').pop(); return Math.round(last.getBoundingClientRect().bottom - el.getBoundingClientRect().top); });
  console.log(i + 1, 'content bottom', over);
  await s.screenshot({ path: `mock-${i + 1}.png` });
}
await b.close();
