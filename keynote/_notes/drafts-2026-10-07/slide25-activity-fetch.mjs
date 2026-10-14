// Fetch every issue, pull request and release of the public repos listed (unauthenticated) for three orgs.
// Read only. The token is minted in memory and never written or printed.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;
const TOKEN = execFileSync('/Users/jwildfire/Documents/obot2/obot.agent/scripts/obot-app-token', { encoding: 'utf8' }).trim();
if (!TOKEN) { console.error('empty token'); process.exit(1); }
const H = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'slide25-activity-count' };

const repos = [];
for (const org of ['Gilead-Public', 'Gilead-BioStats', 'OpenRBQM']) {
  const a = JSON.parse(fs.readFileSync(`${dir}${org}.repos.1.json`, 'utf8'));
  for (const r of a) repos.push({ org, name: r.name, full: r.full_name, created_at: r.created_at, pushed_at: r.pushed_at, fork: r.fork, archived: r.archived, language: r.language, description: r.description });
}

let calls = 0;
async function pages(url) {
  const out = [];
  while (url) {
    const res = await fetch(url, { headers: H });
    calls++;
    if (!res.ok) throw new Error(`${res.status} ${url} ${(await res.text()).slice(0, 200)}`);
    const j = await res.json();
    out.push(...j);
    const link = res.headers.get('link') || '';
    const m = link.match(/<([^>]+)>;\s*rel="next"/);
    url = m ? m[1] : null;
  }
  return out;
}

const started = new Date().toISOString();
const result = { started, repos: {} };
for (const r of repos) {
  const base = `https://api.github.com/repos/${r.full}`;
  let issues = [], releases = [], err = null;
  try {
    issues = (await pages(`${base}/issues?state=all&per_page=100&sort=created&direction=asc`)).map(i => ({
      n: i.number, pr: !!i.pull_request, created: i.created_at, closed: i.closed_at,
      merged: i.pull_request ? i.pull_request.merged_at : null,
      user: i.user ? i.user.login : null, utype: i.user ? i.user.type : null, reason: i.state_reason || null,
    }));
    releases = (await pages(`${base}/releases?per_page=100`)).map(x => ({
      tag: x.tag_name, published: x.published_at, created: x.created_at, draft: x.draft, prerelease: x.prerelease,
      user: x.author ? x.author.login : null, utype: x.author ? x.author.type : null,
    }));
  } catch (e) { err = String(e.message); }
  result.repos[r.full] = { meta: r, issues, releases, err };
  console.log(`${r.full}\tissues+prs=${issues.length}\tprs=${issues.filter(i => i.pr).length}\treleases=${releases.length}\t${err || ''}`);
}
result.finished = new Date().toISOString();
result.calls = calls;
fs.writeFileSync(`${dir}raw.json`, JSON.stringify(result));
console.log('calls', calls, 'started', started, 'finished', result.finished);
