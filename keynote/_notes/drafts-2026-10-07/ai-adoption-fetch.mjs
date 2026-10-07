// Fetch every issue, pull request (with size, reviews, body), release and comment of the 25 public
// repositories counted for the keynote, into raw.json beside this script. Read only.
// The app token is minted in memory, used for the request allowance only (it reads public
// repositories in these organisations), and never written or printed.
//
//   node ai-adoption-fetch.mjs            # writes raw.json
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;
const TOKEN_SCRIPT = '/Users/jwildfire/Documents/obot2/obot.roadmap/scripts/obot-app-token'; // moved from obot.agent/scripts on 2026-10-07
const TOKEN = execFileSync(TOKEN_SCRIPT, { encoding: 'utf8' }).trim();
if (!TOKEN) { console.error('empty token'); process.exit(1); }
const H = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'keynote-ai-adoption-count' };

import { REPOS as ALL } from './ai-adoption-repos.mjs';
// node ai-adoption-fetch.mjs                      every repository, fresh raw.json
// node ai-adoption-fetch.mjs <org/repo> [...]     only these, merged into the existing raw.json (used to retry a failure)
const ONLY = process.argv.slice(2);
const REPOS = ONLY.length ? ONLY : ALL;

let calls = 0;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function gql(query, variables) {
  let last = '';
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
    calls++;
    const txt = await res.text();
    let j; try { j = JSON.parse(txt); } catch { j = null; }
    if (res.ok && j && j.data && !j.errors) return j.data;
    last = `${res.status} ${txt.slice(0, 300)}`;
    if (res.status === 401 || res.status === 403 || res.status === 404) break;
    await sleep(3000 * (attempt + 1));
  }
  throw new Error('graphql failed after retries: ' + last);
}
async function restPages(url) {
  const out = [];
  while (url) {
    const res = await fetch(url, { headers: H });
    calls++;
    if (!res.ok) throw new Error(`${res.status} ${url} ${(await res.text()).slice(0, 200)}`);
    out.push(...await res.json());
    const m = (res.headers.get('link') || '').match(/<([^>]+)>;\s*rel="next"/);
    url = m ? m[1] : null;
  }
  return out;
}

const Q_ISSUES = `query($owner:String!,$name:String!,$after:String){ repository(owner:$owner,name:$name){
  createdAt isPrivate isArchived defaultBranchRef{name}
  issues(first:100, after:$after, orderBy:{field:CREATED_AT,direction:ASC}){ pageInfo{hasNextPage endCursor}
    nodes{ number createdAt closedAt stateReason author{login __typename} body comments{totalCount} } } } }`;
const Q_PRS = `query($owner:String!,$name:String!,$after:String){ repository(owner:$owner,name:$name){
  pullRequests(first:30, after:$after, orderBy:{field:CREATED_AT,direction:ASC}){ pageInfo{hasNextPage endCursor}
    nodes{ number createdAt closedAt mergedAt isDraft author{login __typename} mergedBy{login __typename} body
      additions deletions changedFiles baseRefName headRefName commits{totalCount} comments{totalCount}
      reviews(first:60){ totalCount nodes{ author{login __typename} state submittedAt } } } } } }`;

const started = new Date().toISOString();
const result = ONLY.length ? JSON.parse(fs.readFileSync(`${dir}raw.json`, 'utf8')) : { started, repos: {} };
if (ONLY.length) (result.retries ??= []).push({ started, repos: ONLY });
for (const full of REPOS) {
  const [owner, name] = full.split('/');
  const r = { meta: null, issues: [], prs: [], releases: [], issue_comments: [], review_comments: [], err: null };
  try {
    let after = null;
    do {
      const d = (await gql(Q_ISSUES, { owner, name, after })).repository;
      r.meta = { created_at: d.createdAt, private: d.isPrivate, archived: d.isArchived, default_branch: d.defaultBranchRef ? d.defaultBranchRef.name : null };
      if (d.isPrivate) throw new Error('repository is private; not counted');
      for (const i of d.issues.nodes) r.issues.push({ n: i.number, created: i.createdAt, closed: i.closedAt, reason: i.stateReason, user: i.author ? i.author.login : null, utype: i.author ? i.author.__typename : null, body: i.body || '', comments: i.comments.totalCount });
      after = d.issues.pageInfo.hasNextPage ? d.issues.pageInfo.endCursor : null;
    } while (after);
    after = null;
    do {
      const d = (await gql(Q_PRS, { owner, name, after })).repository;
      for (const p of d.pullRequests.nodes) r.prs.push({
        n: p.number, created: p.createdAt, closed: p.closedAt, merged: p.mergedAt, draft: p.isDraft,
        user: p.author ? p.author.login : null, utype: p.author ? p.author.__typename : null,
        merged_by: p.mergedBy ? p.mergedBy.login : null, body: p.body || '',
        additions: p.additions, deletions: p.deletions, files: p.changedFiles, base: p.baseRefName, head: p.headRefName,
        commits: p.commits.totalCount, comments: p.comments.totalCount, reviews_total: p.reviews.totalCount,
        reviews: p.reviews.nodes.map(v => ({ user: v.author ? v.author.login : null, utype: v.author ? v.author.__typename : null, state: v.state, at: v.submittedAt })),
      });
      after = d.pullRequests.pageInfo.hasNextPage ? d.pullRequests.pageInfo.endCursor : null;
    } while (after);
    const base = `https://api.github.com/repos/${full}`;
    r.releases = (await restPages(`${base}/releases?per_page=100`)).map(x => ({ tag: x.tag_name, published: x.published_at, draft: x.draft, prerelease: x.prerelease, user: x.author ? x.author.login : null, utype: x.author ? x.author.type : null }));
    const slim = c => ({ created: c.created_at, user: c.user ? c.user.login : null, utype: c.user ? c.user.type : null, body: c.body || '', on: (c.issue_url || c.pull_request_url || '').split('/').pop() });
    r.issue_comments = (await restPages(`${base}/issues/comments?since=2024-12-31T00:00:00Z&per_page=100&sort=created&direction=asc`)).map(slim);
    r.review_comments = (await restPages(`${base}/pulls/comments?since=2024-12-31T00:00:00Z&per_page=100&sort=created&direction=asc`)).map(slim);
  } catch (e) { r.err = String(e.message); }
  result.repos[full] = r;
  console.log(`${full}\tissues=${r.issues.length}\tprs=${r.prs.length}\treleases=${r.releases.length}\tissue_comments=${r.issue_comments.length}\treview_comments=${r.review_comments.length}\t${r.err || ''}`);
}
result.finished = new Date().toISOString();
result.calls = (ONLY.length ? result.calls : 0) + calls;
fs.writeFileSync(`${dir}raw.json`, JSON.stringify(result));
console.log('calls', calls, 'started', started, 'finished', result.finished);
