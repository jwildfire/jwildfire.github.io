# What we built: the figures on slide 44

Counted on 13 October 2026, 11:44 to 12:30 UTC. The slide's notes carry every figure with its per-repository breakdown; this folder holds what is needed to count again before the talk.

## What is counted

Fifteen repositories under github.com/jwildfire, from 1 May 2026:

- Charts and apps: safety.viz, gsm.safety, bio.viz, gsm.bio, open.csr, open.gismo, demo-301
- Scaffold: obot.agent, obot.roadmap, scaffold
- Other: showlist, RPharma2026-AIKeynote, the safetyGraphics and safetyCharts forks, the archived safety-histogram fork

## How to count again

- Pull requests and issues: `python3 count-github.py` (two batched GraphQL searches through `gh`; writes `counts.json` where it is run). The REST search endpoint allows 30 requests a minute, which this many repositories exceeds.
- Releases: `gh api "repos/jwildfire/<repo>/releases?per_page=100"`, published on or after 2026-05-01, drafts left out.
- Lines: `python3 count-lines.py "name|path-to-clone|ref" ...` counts source and test lines at a ref, leaving out built bundles, evidence, vendored code, data, fixtures, lockfiles, generated R documentation and rendered pages. Two repositories need care: open.csr's `outputs/` and `docs/assembled` are generated and were taken out by hand, and open.gismo is counted as what the fork's `dev` added since the fork point (`1072c62`, 24 June).
- Tests: the count of tests run from the latest release's notes where they give one (safety.viz, bio.viz, gsm.bio); elsewhere test definitions in the files (`test_that(` in R, `it(` or `test(` in JavaScript).
- Charts: the `renderers` list in safety.viz `site/config.json` with status `available`, and the six chart modules in bio.viz `site/config.json`.
- Clinical guides: the `guide.html` page beside a chart on the safety.viz site (source in `docs/guides/`).

## The figures of 13 October

| Figure | Value |
|---|---|
| Pull requests merged | 599 (341 charts and apps, 253 scaffold, 5 other) |
| Releases | 43 (31 charts and apps, 11 scaffold, 1 other) |
| Lines of source | 344,591 (197,168 source, 147,423 tests) |
| Tests | 5,552 |
| Interactive charts | 20 (14 safety.viz, 6 bio.viz) |
| Apps | 3 |
| Clinical guides | 7 (18,762 words) |

The same change moved the quality slide's test count (slide 46) from 2,627 to 2,963 so that the two slides agree.
