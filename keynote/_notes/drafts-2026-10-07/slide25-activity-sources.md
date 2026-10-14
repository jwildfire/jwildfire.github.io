# Slide 25, "What changed": sources

Draft of 2026-10-07 for the two options in `slide25-activity.html`. Not in the deck. Every word on the slides is draft wording for Jeremy to replace; this file is the record of where each number came from.

## The short version

- The slide today says: releases up 50% on last year, issues and pull requests roughly doubled (from the diary post of 10 June 2026).
- The public record falls short of that. Same dates in both years, 1 January to 6 October, 25 public repositories, bots left out:

| Measure | 2025 | 2026 | Change | With bots counted too |
|---|---|---|---|---|
| Releases published (version tags) | 60 | 47 | −22% | 63 → 56, −11%, counting every tag |
| Issues opened | 491 | 594 | +21% | 491 → 614, +25% |
| Issues closed | 425 | 466 | +10% | 425 → 486, +14% |
| Pull requests opened | 403 | 484 | +20% | 407 → 542, +33% |
| Pull requests merged | 359 | 401 | +12% | 363 → 437, +20% |

- Nothing doubled on any window tried. Releases are down on every same-dates window.
- The one way the "+50% releases" comes back: the 12 months to 9 June 2026 against the 12 months before, 41 → 62, +51%. That window is lifted by March 2025, when the single gsm package became several and each began releasing on its own.
- The post may have counted repositories that are not public. That cannot be checked from public data, so it is not claimed either way.

## What was counted

- Releases: GitHub releases, by the date published. A release counts when its tag looks like a version (`v1.2.3`). Fifteen other tags since January 2025 are left out: twelve `NN/merge` builds a workflow published, plus `ForTesting`, `main` and `PhuseConnect2025`. They are listed in the data file under `release_tags_not_counted_as_versions`. Releases a workflow published under a version tag are kept.
- Issues opened and closed: issues that are not pull requests, by the date created and the date closed (closed for any reason).
- Pull requests opened and merged: by the date created and the date merged.
- Bots: an item is a bot's when the account that opened it is of type Bot. Since January 2025 that is four accounts.
  - dependabot: 5 pull requests in 2025, 30 in 2026 (dependency updates).
  - cm-operations-bot: 23 pull requests in 2026, every one titled "chore: auto-update workflow templates".
  - ci-gh-app: 5 pull requests in 2026 on the OpenRBQM home page (news and data cache refreshes).
  - github-actions: 20 issues in 2026 (16 in qcthat, 3 in gsm.qtl, 1 in gsm.kri).
- Dates are UTC days. Windows include the first day and the last.
- Nothing on or after 7 October 2026 is counted. In the monthly table, October 2026 is 1 to 6 October only; October 2025 is the whole month.
- Work an AI agent did through a person's account counts as that person's. GitHub cannot tell the two apart.

## Repositories

Public repositories were listed without a login from the three organisations (commands below). The four core packages moved from Gilead-BioStats to a new organisation, Gilead-Public, on 2026-09-21; their issues, pull requests and releases moved with them, and the old addresses are stubs.

Counted, 25. The figures are 2025 → 2026 for 1 January to 6 October, bots left out.

| Repository | Releases | Issues opened | Issues closed | Pull requests opened | Pull requests merged |
|---|---|---|---|---|---|
| Gilead-Public/gsm | 4 → 1 | 16 → 1 | 43 → 1 | 22 → 4 | 21 → 3 |
| Gilead-Public/gsm.viz | 2 → 2 | 21 → 63 | 22 → 38 | 17 → 51 | 13 → 37 |
| Gilead-Public/qcthat | 0 → 4 | 4 → 133 | 1 → 139 | 2 → 53 | 2 → 49 |
| Gilead-Public/gsm.qtl | 3 → 7 | 34 → 35 | 29 → 26 | 22 → 44 | 20 → 39 |
| Gilead-Public/gsm.datasim | 4 → 2 | 25 → 44 | 17 → 27 | 29 → 31 | 24 → 22 |
| Gilead-Public/gsm.mapping | 7 → 5 | 39 → 42 | 32 → 28 | 34 → 35 | 30 → 31 |
| Gilead-Public/gsm.kri | 10 → 8 | 69 → 85 | 47 → 56 | 54 → 66 | 47 → 49 |
| Gilead-Public/gsm.reporting | 8 → 4 | 19 → 11 | 18 → 9 | 29 → 17 | 26 → 17 |
| Gilead-Public/gsm.core | 7 → 6 | 37 → 37 | 27 → 22 | 50 → 42 | 44 → 34 |
| Gilead-Public/gsm.utils | 1 → 2 | 12 → 49 | 1 → 50 | 3 → 57 | 2 → 48 |
| Gilead-Public/workr | 0 → 2 | 0 → 46 | 0 → 34 | 0 → 43 | 0 → 40 |
| Gilead-Public/gsm.guide | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 1 | 0 → 1 |
| Gilead-Public/gsm.vizr | 0 → 1 | 0 → 5 | 0 → 3 | 0 → 4 | 0 → 3 |
| Gilead-Public/gsm.dash | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| Gilead-BioStats/clindata | 0 → 0 | 0 → 0 | 0 → 0 | 1 → 0 | 1 → 0 |
| Gilead-BioStats/gsm.app | 8 → 0 | 147 → 6 | 141 → 3 | 81 → 3 | 74 → 1 |
| Gilead-BioStats/gsm.qc | 5 → 0 | 14 → 0 | 13 → 0 | 28 → 0 | 27 → 1 |
| Gilead-BioStats/gh.dash | 0 → 2 | 0 → 24 | 0 → 19 | 0 → 25 | 0 → 20 |
| Gilead-BioStats/open.gismo | 0 → 1 | 0 → 7 | 0 → 3 | 0 → 3 | 0 → 1 |
| OpenRBQM/OpenRBQM.github.io | 0 → 0 | 4 → 5 | 0 → 8 | 9 → 5 | 8 → 5 |
| OpenRBQM/gsm.digitpref | 0 → 0 | 0 → 1 | 1 → 0 | 3 → 0 | 2 → 0 |
| OpenRBQM/gsm.ae | 1 → 0 | 33 → 0 | 26 → 0 | 9 → 0 | 9 → 0 |
| OpenRBQM/openrbqm | 0 → 0 | 4 → 0 | 1 → 0 | 3 → 0 | 2 → 0 |
| OpenRBQM/openRBQM-workshop | 0 → 0 | 7 → 0 | 6 → 0 | 7 → 0 | 7 → 0 |
| OpenRBQM/gsm.pd | 0 → 0 | 6 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |

Public, but not counted, 12.

- Gilead-Public/Open-SMART-PMI (Python) and Gilead-Public/CLAIRE (C#): judged not part of the gsm ecosystem from their names and languages; neither has a description. Together they hold 2 pull requests in the 2025 window and 23 in 2026, no issues, and 1 release in 2026. Jeremy to confirm.
- Gilead-BioStats/gsm.core, gsm.mapping, gsm.kri, gsm.reporting: redirect stubs created 2026-09-21 ("Moved to Gilead-Public/…"). Empty. The packages are counted at their new address.
- Gilead-Public/.github, biostats-gsm, test123, and OpenRBQM/cluster, gsm.query: no issues, pull requests or releases at all.
- OpenRBQM/openRBQM-workshop-EU25: a fork; its 3 pull requests fall outside both windows.

Not public, so not counted. Each returned 404 without a login at all three organisations (checked 2026-10-07 11:43 to 11:46 UTC):

- gsm.simaerep, grail, gsm.library, ae.detector, big.library, big.dash, gsm.site, gsm.template, gsm.study.profile, gsm.roadmap, gsm.agent, r-qualification, data.wg, playground.
- simaerep is not in these three organisations; its public home is elsewhere and it was not counted.
- rbm-viz is now Gilead-Public/gsm.viz (the old address redirects) and is counted.

## Other windows tried

All for the same 25 repositories, bots left out. Every window, in four variants, is in the data file under `comparisons`.

| Window | Releases | Issues opened | Issues closed | Pull requests opened | Pull requests merged |
|---|---|---|---|---|---|
| 1 January to 6 October, 2026 against 2025 | 60 → 47 (−22%) | 491 → 594 (+21%) | 425 → 466 (+10%) | 403 → 484 (+20%) | 359 → 401 (+12%) |
| 1 January to 9 June, 2026 against 2025 (what the post could see) | 31 → 27 (−13%) | 314 → 381 (+21%) | 229 → 306 (+34%) | 246 → 282 (+15%) | 218 → 233 (+7%) |
| January to May, whole months | 30 → 27 (−10%) | 295 → 356 (+21%) | 219 → 296 (+35%) | 231 → 265 (+15%) | 210 → 224 (+7%) |
| 12 months to 9 June 2026 against the 12 months before | 41 → 62 (+51%) | 763 → 704 (−8%) | 623 → 601 (−3%) | 555 → 494 (−11%) | 499 → 428 (−14%) |
| 12 months to 6 October 2026 against the 12 months before | 67 → 53 (−21%) | 655 → 740 (+13%) | 566 → 565 (0%) | 526 → 539 (+3%) | 470 → 455 (−3%) |
| 10 June to 6 October, 2026 against 2025 (since the post) | 29 → 20 (−31%) | 177 → 213 (+20%) | 196 → 160 (−18%) | 157 → 202 (+29%) | 141 → 168 (+19%) |
| Whole years, 2025 against 2024 | 21 → 66 (+214%) | 585 → 637 (+9%) | 534 → 524 (−2%) | 392 → 458 (+17%) | 353 → 413 (+17%) |
| 1 January to 6 October, without qcthat | 60 → 43 (−28%) | 487 → 461 (−5%) | 424 → 327 (−23%) | 401 → 431 (+8%) | 357 → 352 (−1%) |
| 1 January to 6 October, without gsm.app | 52 → 47 (−10%) | 344 → 588 (+71%) | 284 → 463 (+63%) | 322 → 481 (+49%) | 285 → 400 (+40%) |
| 1 January to 9 June, without gsm.app | 28 → 27 (−4%) | 239 → 378 (+58%) | 178 → 304 (+71%) | 199 → 280 (+41%) | 172 → 232 (+35%) |
| 1 January to 6 October, six pipeline packages only | 39 → 31 (−20%) | 214 → 211 (−1%) | 196 → 142 (−28%) | 211 → 208 (−1%) | 188 → 173 (−8%) |

What these say:

- The answer depends on which repositories are in. Two of them pull in opposite directions: qcthat (4 issues opened → 133) and gsm.app (147 → 6). Leave out qcthat and issues are down 5%. Leave out gsm.app and they are up 71%.
- The closest the public record gets to "roughly doubled" is issues closed, 1 January to 9 June, without gsm.app: +71%.
- The six pipeline packages on their own are flat on issues and pull requests and down a fifth on releases.
- New in 2026 and carrying much of the rise: workr, gh.dash, qcthat, gsm.utils.

## By month

Bots left out; releases are version tags.

| Month | Releases | Issues opened | Issues closed | Pull requests opened | Pull requests merged |
|---|---|---|---|---|---|
| 2025-01 | 4 | 69 | 45 | 39 | 36 |
| 2025-02 | 4 | 52 | 30 | 36 | 28 |
| 2025-03 | 9 | 44 | 62 | 75 | 68 |
| 2025-04 | 7 | 45 | 32 | 39 | 37 |
| 2025-05 | 6 | 85 | 50 | 42 | 41 |
| 2025-06 | 12 | 80 | 69 | 66 | 60 |
| 2025-07 | 4 | 36 | 22 | 21 | 16 |
| 2025-08 | 1 | 42 | 40 | 15 | 11 |
| 2025-09 | 11 | 26 | 72 | 58 | 55 |
| 2025-10 | 2 | 67 | 32 | 27 | 19 |
| 2025-11 | 3 | 33 | 42 | 21 | 23 |
| 2025-12 | 3 | 58 | 28 | 19 | 19 |
| 2026-01 | 7 | 80 | 55 | 46 | 39 |
| 2026-02 | 1 | 91 | 87 | 51 | 30 |
| 2026-03 | 6 | 43 | 51 | 47 | 50 |
| 2026-04 | 6 | 65 | 52 | 52 | 52 |
| 2026-05 | 7 | 77 | 51 | 69 | 53 |
| 2026-06 | 2 | 57 | 61 | 46 | 43 |
| 2026-07 | 9 | 46 | 43 | 61 | 57 |
| 2026-08 | 7 | 69 | 28 | 61 | 51 |
| 2026-09 | 2 | 57 | 35 | 49 | 24 |
| 2026-10 (1 to 6) | 0 | 9 | 3 | 2 | 2 |

The same counts per repository, with the bot counts beside them, are in `slide25-activity-data.json` under `monthly_by_repo`.

## Commands, and when they ran

All on 2026-10-07, times in UTC. Read only; nothing was written to any of the three organisations.

1. 11:41:42 and 11:42:03. List the public repositories, no login:
   - `curl -s "https://api.github.com/orgs/Gilead-BioStats/repos?per_page=100&type=public&page=1"` (9 repositories)
   - `curl -s "https://api.github.com/orgs/OpenRBQM/repos?per_page=100&type=public&page=1"` (9)
   - `curl -s "https://api.github.com/orgs/Gilead-Public/repos?per_page=100&type=public&page=1"` (19; page 2 is empty)
2. 11:41:55. What the Gilead-BioStats/gsm.core stub is: `GET https://api.github.com/repos/Gilead-BioStats/gsm.core` and its `/readme` ("Moved to Gilead-Public/gsm.core").
3. 11:42:46 to 11:43:52. Every issue, pull request and release of all 37 listed repositories, 115 requests, with the obot app's token (it can read public repositories only in these organisations; it is used for the request allowance, not for access). Script: `slide25-activity-fetch.mjs`. Per repository:
   - `GET https://api.github.com/repos/{owner}/{repo}/issues?state=all&per_page=100&sort=created&direction=asc`, every page
   - `GET https://api.github.com/repos/{owner}/{repo}/releases?per_page=100`, every page
4. 11:43:52 onward. Which named ecosystem repositories load without a login: `curl -s -o /dev/null -w '%{http_code}' https://github.com/{org}/{repo}` for 36 names at each of the three organisations (200 public, 301 moved, 404 not public).
5. Counting: `node slide25-activity-analyze.mjs slide25-activity-data.json`, over the fetched records. It writes the data file and prints every comparison.
6. 11:46:49. The every-author totals re-counted a second way, with the search API and no login. All eight matched (491, 614, 425, 486, 407, 542, 363, 437). The query, with `{what}` one of `is:issue created`, `is:issue closed`, `is:pr created`, `is:pr merged` and `{year}` 2025 or 2026:
   - `curl -s -G "https://api.github.com/search/issues" --data-urlencode "q=org:Gilead-Public org:Gilead-BioStats org:OpenRBQM -repo:Gilead-Public/Open-SMART-PMI -repo:Gilead-Public/CLAIRE {what}:{year}-01-01..{year}-10-06" --data-urlencode "per_page=1"` and read `total_count`
7. 11:52:01. The same eight with bots left out, by adding `-author:app/dependabot -author:app/github-actions -author:app/cm-operations-bot -author:app/ci-gh-app` to the query. All eight matched the slide's figures (491, 594, 425, 466, 403, 484, 359, 401).
8. 11:47:41. What the bot pull requests are: the same search with `author:app/cm-operations-bot` and `author:app/ci-gh-app`, reading the titles.
9. The page and the pictures: `node slide25-activity-build.mjs` (reads the deck's own styles from `keynote/slides.html` and the data file; it stops with an error if the five headline counts have moved), then `node slide25-activity-shot.cjs` (Playwright from safety.viz, 1600 by 900).

The scripts were run from a scratch folder and copied here as a record. The fetch script expects the three listings from step 1 saved beside it as `{org}.repos.1.json`. Step 6 or 7 reproduces the headline numbers with no script and no login.

The search API has no release counts, so the release figures rest on the fetch in step 3 alone. To check one by eye: https://github.com/Gilead-Public/gsm.kri/releases.

## The slides

- Option A (`slide25-activity.png`): the big number, "+20%" pull requests opened, with a line chart of pull requests opened in each whole month, January to September, beside it.
- Option B (`slide25-activity-option-b.png`): five panels, one per measure, each with its change, the two counts, and the two years by month.
- In both: 2026 is the slide's teal, 2025 the deck's grey; the lines also differ in weight and are named in words. Checked with the dataviz skill's palette validator against the paper background (colour-blind separation 17.8, normal vision 21.2, both pass).
- The lines are whole months, January to September. The numbers also count 1 to 6 October (pull requests opened: 12 in 2025, 2 in 2026). This is said on option B and in both sets of notes.
- In option B the four issue and pull request panels share one scale (0 to 100 a month). Releases has its own (0 to 12).
- Smallest text I added is 22px. The deck's own footer and slide number are 20px and were left alone.
- The page loads the deck's three fonts from Google Fonts, as the deck does. The charts are inline SVG and load nothing.
- Each `<section>` sits between BEGIN and END comments. The orange "Draft" tag at the top of each is one `<p class="draft-tag">` line to remove.

## Caveats

- Activity is not output. An issue can be a typo or a quarter's work.
- The mix of repositories changed between the years, which the per-repository table shows. The comparison is of the public footprint, not of a fixed set of packages.
- One release train now publishes several packages on the same day (for example 2026-07-17), and each counts as a release.
- Issues that were deleted or moved to a repository that is not public are not in the record. Draft releases are not visible.
- A repository's past visibility cannot be seen. Everything here is what is public on 7 October 2026.
- 14 accounts opened an issue or pull request in the 2025 window and 12 in 2026 (6 in both). That is a count of accounts, not of team size.
- UTC days. A handful of items near midnight would fall on the other side in US time.

## For Jeremy to confirm

- Whether to replace the June figures with these, or with internal ones he can stand behind. The public record does not support "+50%" or "roughly doubled", so a slide that keeps them needs a source that is not this one.
- The wrap-up slide that follows repeats "releases up about 50%; issues and pull requests roughly doubled" and needs the same decision.
- The repository list: qcthat in (it carries most of the rise in issues), Open-SMART-PMI and CLAIRE out.
- Bots left out of the slide figures. The with-bots figures are in the first table if he prefers them.
- Whether the figures in the June post covered repositories that are not public. Not verified here.
- The numbers stop at 6 October. Re-run steps 3 and 5 the week of the talk.

---

Drafted by Claude Code using Opus 5.5, for review by @jwildfire.
