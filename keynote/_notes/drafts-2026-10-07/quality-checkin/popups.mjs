// Mock only: injects inspector popups into the real deck in the browser and screenshots. slides.html is not changed.
import { createRequire } from 'module';
const require = createRequire('/Users/jwildfire/Documents/obot2/safety.viz/');
const { chromium } = require('playwright');
const POPUPS = [
  { n: 10, a: 'Not much. It was exploratory.', side: 'right' },
  { n: 15, a: 'A test for every requirement', side: 'right' },
  { n: 23, a: 'The same tests, and a human owner', side: 'right' },
  { n: 26, a: 'None yet. Ask me later.', side: 'right' },
  { n: 46, a: 'Lots of tests. No sign-off.', side: 'right' },
];
const css = `
  .goodat.insp .bub { background: #e9f3ea; border-color: #5f9a72; }
  .goodat.insp .bub::after { background: #e9f3ea; border-color: #5f9a72; }
  .goodat.insp .who::before { display: none; }
  .goodat.insp .who::after { inset: 0; clip-path: none; background: url(assets/hex/orange-question.png) center / contain no-repeat; }
  .goodat.insp .a { font-size: 46px; }
`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
const f = 'file:///Users/jwildfire/Documents/github/jwildfire.github.io/.claude/worktrees/keynote-deck/keynote/slides.html?reveal';
for (const q of POPUPS) {
  await p.goto(f + '#' + q.n); await p.reload(); await p.waitForTimeout(600);
  await p.addStyleTag({ content: css });
  await p.evaluate((q) => {
    const s = document.querySelector('.slide.active');
    s.querySelectorAll('.review').forEach(e => e.remove());
    const d = document.createElement('div'); d.className = 'goodat insp';
    d.innerHTML = '<div class="bub"><p class="q">What evidence do you have?</p><p class="a">' + q.a + '</p></div><div class="who"></div>';
    s.appendChild(d);
  }, q);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `popup-${q.n}.png` });
}
await b.close();
