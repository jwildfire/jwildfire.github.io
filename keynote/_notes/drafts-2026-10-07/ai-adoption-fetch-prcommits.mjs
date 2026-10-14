// For every pull request created since 2025-01-01 in raw.json, list the hashes of its commits,
// so a pull request can be matched to the commit trailers read from the clones. Writes prcommits.json.
// Read only; the app token stays in memory.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const TOKEN = execFileSync('/Users/jwildfire/Documents/obot2/obot.roadmap/scripts/obot-app-token', { encoding: 'utf8' }).trim();
if (!TOKEN) { console.error('empty token'); process.exit(1); }
const H = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'keynote-ai-adoption-count' };
const raw = JSON.parse(fs.readFileSync(dir + 'raw.json', 'utf8'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
let calls = 0;
async function gql(query) {
  let last = '';
  for (let a = 0; a < 5; a++) {
    const res = await fetch('https://api.github.com/graphql', { method: 'POST', headers: H, body: JSON.stringify({ query }) });
    calls++;
    const txt = await res.text(); let j = null; try { j = JSON.parse(txt); } catch {}
    if (res.ok && j && j.data && !j.errors) return j.data;
    last = `${res.status} ${txt.slice(0, 300)}`;
    if ([401, 403, 404].includes(res.status)) break;
    await sleep(3000 * (a + 1));
  }
  throw new Error(last);
}
const started = new Date().toISOString();
const out = {};
for (const [full, r] of Object.entries(raw.repos)) {
  const [owner, name] = full.split('/');
  const nums = r.prs.filter(p => p.created >= '2025-01-01').map(p => p.n);
  out[full] = {};
  for (let i = 0; i < nums.length; i += 20) {
    const part = nums.slice(i, i + 20);
    const q = `{ repository(owner:"${owner}",name:"${name}"){ ${part.map(n => `p${n}: pullRequest(number:${n}){ commits(first:100){ totalCount pageInfo{hasNextPage endCursor} nodes{ commit{ oid } } } }`).join(' ')} } }`;
    const d = (await gql(q)).repository;
    for (const n of part) {
      const c = d['p' + n].commits;
      const oids = c.nodes.map(x => x.commit.oid);
      let pi = c.pageInfo;
      while (pi.hasNextPage) {
        const d2 = (await gql(`{ repository(owner:"${owner}",name:"${name}"){ pullRequest(number:${n}){ commits(first:100, after:"${pi.endCursor}"){ pageInfo{hasNextPage endCursor} nodes{ commit{ oid } } } } } }`)).repository.pullRequest.commits;
        oids.push(...d2.nodes.map(x => x.commit.oid)); pi = d2.pageInfo;
      }
      out[full][n] = oids;
    }
  }
  console.log(full, 'prs', nums.length, 'commits', Object.values(out[full]).reduce((a, b) => a + b.length, 0));
}
fs.writeFileSync(dir + 'prcommits.json', JSON.stringify({ started, finished: new Date().toISOString(), calls, prs: out }));
console.log('calls', calls);
