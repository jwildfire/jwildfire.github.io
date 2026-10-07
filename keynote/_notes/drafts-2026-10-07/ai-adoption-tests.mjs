// Which commits add or change a test file. Read from every branch, tag and pull request head of the
// clones (commit and tree objects only, so the blob-less clones are enough). Writes tests.json:
// one row per commit that touches a test file, plus whether it is on the default branch.
// A "test file" is tests/testthat/test-*.R (R packages) or *.test.js / *.spec.js / a .js file under
// tests/ or __tests__/ (the JavaScript library). Snapshot and fixture files are not test files.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { REPOS } from './ai-adoption-repos.mjs';
const dir = new URL('.', import.meta.url).pathname;
const isTest = p => /(^|\/)tests\/testthat\/test[-_][^/]*\.[rR]$/.test(p) || /\.(test|spec)\.(js|mjs|ts)$/.test(p) || /(^|\/)(tests?|__tests__)\/.*\.(js|mjs|ts)$/.test(p);
const rows = [];
for (const full of REPOS) {
  const gd = `${dir}clones/${full.replace('/', '_')}.git`;
  const git = a => execFileSync('git', ['--git-dir=' + gd, ...a], { encoding: 'utf8', maxBuffer: 1 << 30 });
  const onDefault = new Set(git(['rev-list', 'HEAD']).split('\n').filter(Boolean));
  const out = git(['log', '--all', '--no-merges', '--no-renames', '--diff-filter=AM', '--name-status', '--format=%x1e%H%x1f%aI']);
  let n = 0;
  for (const rec of out.split('\x1e').slice(1)) {
    const [head, ...lines] = rec.split('\n');
    const [sha, ad] = head.split('\x1f');
    const files = lines.filter(Boolean).map(l => l.split('\t')).filter(f => isTest(f[1] || ''));
    if (!files.length) continue;
    n++;
    rows.push({ repo: full, sha, date: new Date(ad).toISOString(), on_default: onDefault.has(sha), test_files_added: files.filter(f => f[0] === 'A').length, test_files_changed: files.length });
  }
  console.log(full, 'commits touching a test file (all refs, all time):', n);
}
fs.writeFileSync(dir + 'tests.json', JSON.stringify({ made: new Date().toISOString(), rows }));
