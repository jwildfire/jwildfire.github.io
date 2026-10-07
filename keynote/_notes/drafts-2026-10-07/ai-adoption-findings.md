# Did the public record change when the team adopted AI coding agents?

Draft of 2026-10-07 for the R/Pharma 2026 keynote. Not in the deck. It tests a hypothesis; it does not set out to confirm it. Builds on `slide25-activity-sources.md` (same 25 public repositories, same definitions) and does not repeat it.

## The answer in five lines

- The hypothesis holds in part, and only from April. Pull requests opened are up 40% for April to September against the same months of 2025 (241 → 338). In January to March they were down 4%. Releases are down about a fifth, for the year so far (58 → 47) and since April (41 → 33), and issues closed did not rise.
- Much of that 40% is a weak 2025, not a strong 2026. July to September 2025 was a slump (94 pull requests opened); 2026 did not repeat it (171). 171 is level with the busiest quarter in the record (170, late 2022), and early 2025 was nearly as busy (150, 147) with almost no AI in sight.
- The year-to-date answer flips with the choice of repositories, from −22% to +96% on pull requests opened. The "since April" rise survives most choices but not all.
- The clearest thing the record shows is the adoption itself. Since April, 148 of 338 pull requests (44%) carry an AI agent's mark; in the same months of 2025 it was 6 of 241 (2.5%). The step is in April 2026, which matches "Q1/Q2 this year".
- Recommended visual: candidate A, the quarterly bars with the marked share inside them. It shows the adoption and, honestly, that volume is back to earlier peaks rather than beyond them.

Activity is not output. Nothing here measures whether the software got better or shipped sooner.

## Each part of the hypothesis

"I expect that PR creation and definitely issue creation/close should be up. probably also releases."

All 25 public repositories, bots left out, 2026 against the same months of 2025.

| Measure | January to March (before the step) | April to September (since) | January to September | Verdict |
|---|---|---|---|---|
| Pull requests opened | 150 → 144 (−4%) | 241 → 338 (+40%) | 391 → 482 (+23%) | Holds since April. Not before. |
| Pull requests merged | 132 → 119 (−10%) | 220 → 280 (+27%) | 352 → 399 (+13%) | Holds since April. Not before. |
| Issues opened | 165 → 214 (+30%) | 314 → 371 (+18%) | 479 → 585 (+22%) | Up, but most of the rise came before the step. |
| Issues closed | 137 → 193 (+41%) | 285 → 270 (−5%) | 422 → 463 (+10%) | Does not hold since April. |
| Releases | 17 → 14 (−18%) | 41 → 33 (−20%) | 58 → 47 (−19%) | Does not hold. Only July to September alone is up (16 → 18). |

- "Before the step" and "since" are split at April because that is where the AI marks jump (see the AI evidence below), not because it flatters the counts.
- With bots counted too, April to September: pull requests opened 244 → 385 (+58%), merged 223 → 308 (+38%), issues opened 314 → 375 (+19%), issues closed 285 → 288 (+1%). The extra pull requests are dependency and workflow-template updates, not AI agents.
- Issues are being opened faster than they are closed. Opened minus closed, January to September: +57 in 2025, +122 in 2026.

## Timing, quarter by quarter

All 25 repositories, bots left out.

| Quarter | Issues opened | Issues closed | Pull requests opened | Pull requests merged | Releases |
|---|---|---|---|---|---|
| 2025 Q1 | 165 | 137 | 150 | 132 | 17 |
| 2025 Q2 | 210 | 151 | 147 | 138 | 25 |
| 2025 Q3 | 104 | 134 | 94 | 82 | 16 |
| 2025 Q4 | 158 | 102 | 67 | 61 | 8 |
| 2026 Q1 | 214 | 193 | 144 | 119 | 14 |
| 2026 Q2 | 199 | 164 | 167 | 148 | 15 |
| 2026 Q3 | 172 | 106 | 171 | 132 | 18 |

Each 2026 quarter against the same quarter of 2025:

| Quarter | Issues opened | Issues closed | Pull requests opened | Pull requests merged | Releases |
|---|---|---|---|---|---|
| Q1 | +30% | +41% | −4% | −10% | −18% |
| Q2 | −5% | +9% | +14% | +7% | −40% |
| Q3 | +65% | −21% | +82% | +61% | +13% |

- There is no step at Q1. Q2 is a modest rise. Q3 is large, and it is large because 2025 Q3 was low.
- The 2025 slump is not a season. July to September was the busiest quarter of 2024 (154 pull requests opened) and a quiet one in 2023 (54). Comparing like quarters does not cancel it.
- Within 2026 the line is nearly flat: 144, 167, 171. The fair reading is "2026 held a high level all year; 2025 fell away after June".
- Against the whole record since 2022: the three busiest quarters for pull requests opened are 2026 Q3 (171), 2022 Q4 (170) and 2026 Q2 (167). For pull requests merged: 2022 Q4 (154), 2026 Q2 (148), 2024 Q3 (143). 2026 is at the top of the range the team has reached before, not outside it.
- With bots counted: pull requests opened 151, 147, 97, 68, then 151, 178, 207. The with-bots tables for every repository set are in `ai-adoption-tables.txt`.

## Which repositories

The rule for "worked on" is at least 5 pull requests merged (bots left out) between 1 January and 6 October. Change 2025 → 2026, bots left out.

| Repository set | Window | Pull requests opened | Pull requests merged | Issues opened | Issues closed | Releases |
|---|---|---|---|---|---|---|
| All 25 | April to September | 241 → 338 (+40%) | 220 → 280 (+27%) | 314 → 371 (+18%) | 285 → 270 (−5%) | 41 → 33 (−20%) |
| All 25 | January to September | 391 → 482 (+23%) | 352 → 399 (+13%) | 479 → 585 (+22%) | 422 → 463 (+10%) | 58 → 47 (−19%) |
| Worked on in both years (8) | April to September | 162 → 219 (+35%) | 146 → 176 (+21%) | 165 → 250 (+52%) | 136 → 161 (+18%) | 29 → 26 (−10%) |
| Worked on in both years (8) | January to September | 233 → 290 (+25%) | 205 → 233 (+14%) | 237 → 314 (+33%) | 190 → 212 (+12%) | 39 → 34 (−13%) |
| Without repositories new in 2026 (19) | April to September | 241 → 290 (+20%) | 220 → 236 (+7%) | 314 → 316 (+1%) | 285 → 228 (−20%) | 41 → 29 (−29%) |
| Without repositories new in 2026 (19) | January to September | 391 → 406 (+4%) | 352 → 334 (−5%) | 479 → 503 (+5%) | 422 → 404 (−4%) | 58 → 41 (−29%) |
| Worked on in 2026 (12), chosen on the outcome | April to September | 167 → 324 (+94%) | 150 → 271 (+81%) | 179 → 359 (+101%) | 138 → 263 (+91%) | 30 → 31 (+3%) |
| Worked on in 2026 (12), chosen on the outcome | January to September | 238 → 467 (+96%) | 209 → 389 (+86%) | 253 → 565 (+123%) | 192 → 453 (+136%) | 40 → 44 (+10%) |
| Worked on in 2025 (13), chosen on the baseline | April to September | 236 → 225 (−5%) | 215 → 180 (−16%) | 299 → 254 (−15%) | 283 → 164 (−42%) | 40 → 27 (−33%) |
| Worked on in 2025 (13), chosen on the baseline | January to September | 379 → 297 (−22%) | 343 → 238 (−31%) | 453 → 321 (−29%) | 418 → 216 (−48%) | 57 → 35 (−39%) |
| The six pipeline packages | April to September | 130 → 146 (+12%) | 118 → 120 (+2%) | 132 → 144 (+9%) | 121 → 93 (−23%) | 27 → 24 (−11%) |
| The six pipeline packages | January to September | 205 → 207 (+1%) | 184 → 173 (−6%) | 205 → 204 (−1%) | 194 → 141 (−27%) | 38 → 31 (−18%) |

- The answer flips with the set. That is a finding, not a nuisance.
- "Roughly doubled" does come back, in exactly one cut: the 12 repositories worked on in 2026. That cut picks repositories because they were busy in 2026, so it cannot be used as evidence that 2026 was busier.
- The two fair cuts are the whole public footprint (all 25) and the fixed set (worked on in both years). They agree: pull requests up about a quarter for the year so far, about 35% to 40% since April, releases down.
- July to September alone is up on pull requests opened in every set (from +48% to +200%), because every set shares the weak 2025 quarter.
- Who is in each set:
  - Worked on in both years (8): gsm.viz, gsm.qtl, gsm.datasim, gsm.mapping, gsm.kri, gsm.reporting, gsm.core, OpenRBQM.github.io.
  - Dropped by that rule because they wound down: gsm.app (74 → 1 pull requests merged), gsm.qc (27 → 1), gsm (21 → 3), gsm.ae (9 → 0), openRBQM-workshop (7 → 0), gsm.digitpref, openrbqm, clindata.
  - Dropped because they ramped up from almost nothing: qcthat (2 → 49), gsm.utils (2 → 48).
  - Dropped because they are new in 2026: workr (40), gh.dash (20), gsm.vizr (3), open.gismo (1), gsm.guide (1), gsm.dash (0).
  - Never active: gsm.pd.
- Whether gsm.app and gsm.qc stopped, or carried on somewhere that is not public, cannot be seen from here.

## Per person

Accounts are GitHub accounts that opened at least one issue or pull request in the window, bots left out. A count of accounts is not a count of people or of hours. All 25 repositories.

| Quarter | Accounts | Issues and pull requests opened | Per account | Accounts with 10 or more | Pull requests merged per account that merged any |
|---|---|---|---|---|---|
| 2025 Q1 | 7 | 315 | 45.0 | 4 | 26.4 |
| 2025 Q2 | 12 | 357 | 29.8 | 5 | 15.3 |
| 2025 Q3 | 8 | 198 | 24.8 | 5 | 11.7 |
| 2025 Q4 | 7 | 225 | 32.1 | 5 | 8.7 |
| 2026 Q1 | 8 | 358 | 44.8 | 6 | 14.9 |
| 2026 Q2 | 10 | 366 | 36.6 | 7 | 18.5 |
| 2026 Q3 | 8 | 343 | 42.9 | 7 | 18.9 |

- The number of accounts did not grow. January to September: 14 in 2025, 12 in 2026, 6 of them in both.
- So activity per account rose more than activity. January to September: 62 → 89 items opened per account (+43%). April to September: 43 → 65 (+51%).
- Pull requests merged per account that merged any: January to September 35 → 40 (+13%); April to September 22 → 35 (+59%).
- Per account, 2026 is again at the top of the historical range and not outside it: pull requests opened per account opening any were 24.4 in 2026 Q3, 25.0 in 2025 Q1 and 25.0 in 2022 Q1.
- The work is less concentrated. The busiest account opened 33% of all items in January to September 2025 and 19% in 2026. More accounts opened 10 or more items in a quarter (4 or 5 in 2025, 6 or 7 in 2026).
- In the 8 repositories worked on in both years: 13 accounts → 9, and 36 → 67 items per account, January to September.

## Direct evidence of AI use

This is the firmest part of the record. It is also a floor: an agent's work that carries no mark is invisible.

Pull requests opened by people, all 25 repositories:

| Quarter | Opened | Attribution line in the description | Tool footer | A commit co-authored by an agent | Any of those three ("marked") | Marked share | Reviewed by Copilot | Accounts opening / with a marked one |
|---|---|---|---|---|---|---|---|---|
| 2025 Q1 | 150 | 0 | 0 | 0 | 0 | 0% | 0 | 6 / 0 |
| 2025 Q2 | 147 | 0 | 0 | 1 | 1 | 1% | 18 | 10 / 1 |
| 2025 Q3 | 94 | 0 | 0 | 5 | 5 | 5% | 26 | 8 / 2 |
| 2025 Q4 | 67 | 0 | 0 | 3 | 3 | 4% | 24 | 7 / 1 |
| 2026 Q1 | 144 | 0 | 1 | 8 | 9 | 6% | 74 | 7 / 4 |
| 2026 Q2 | 167 | 11 | 9 | 68 | 68 | 41% | 74 | 8 / 8 |
| 2026 Q3 | 171 | 38 | 7 | 53 | 80 | 47% | 64 | 7 / 7 |

By month in 2026, marked of opened: January 4 of 46, February 2 of 51, March 3 of 47, April 16 of 52, May 22 of 69, June 30 of 46, July 25 of 61, August 18 of 61, September 37 of 49.

- The step is April 2026: 6% in the first quarter, 31% in April, 41% for the second quarter, 47% for the third.
- It is the whole team. Every account that opened a pull request since April has at least one marked one (8 of 8), and 6 of the 8 have five or more. It is not even: three accounts opened two thirds of the marked pull requests, and the marked share of an account's own pull requests runs from 4% to 89%.
- It holds in the fixed set too. In the 8 repositories worked on in both years: 0%, 0%, 4%, 0% through 2025, then 4%, 48%, 55%.
- No pull request was opened by a coding agent's own account (the Copilot coding agent, for example). Every agent-written pull request came through a person's account.
- AI was not absent in 2025. Copilot was reviewing pull requests from April 2025 (12% of them in 2025 Q2, 36% by Q4, 51% in 2026 Q1), and the first Copilot co-author trailer is dated 3 June 2025. What began in April 2026 is agents writing the change, not AI being present.
- Counting a Copilot review or an accepted Copilot suggestion as well, the share of pull requests touched by AI in any way is 0%, 15%, 32%, 40%, 56%, 64%, 56%.

Issues opened by people:

| Quarter | Opened | With the attribution line | Share |
|---|---|---|---|
| 2025 Q1 to Q3 | 479 | 0 | 0% |
| 2025 Q4 | 158 | 3 | 2% |
| 2026 Q1 | 214 | 0 | 0% |
| 2026 Q2 | 199 | 24 | 12% |
| 2026 Q3 | 172 | 66 | 38% |

- In September 2026, 35 of 57 issues opened (61%) say an agent drafted them.
- The tool named in the attribution line, issues and pull requests together: GitHub Copilot 3 (2025 Q4), 35 (2026 Q2), 3 (2026 Q3); Claude Code 88 (2026 Q3); Posit Assistant 13 (2026 Q3).

Commits (every branch, tag and pull request head; each hash once; merges and workflow-bot commits left out):

| Quarter | Commits | With an AI co-author trailer | Of which a Copilot suggestion accepted in the browser | Written with an agent | Share | Copilot trailers | Claude trailers |
|---|---|---|---|---|---|---|---|
| 2025 Q1 | 1,159 | 0 | 0 | 0 | 0% | 0 | 0 |
| 2025 Q2 | 1,144 | 5 | 4 | 1 | 0.1% | 5 | 0 |
| 2025 Q3 | 818 | 15 | 9 | 6 | 0.7% | 15 | 0 |
| 2025 Q4 | 841 | 13 | 9 | 4 | 0.5% | 13 | 0 |
| 2026 Q1 | 2,116 | 50 | 40 | 10 | 0.5% | 50 | 0 |
| 2026 Q2 | 2,340 | 193 | 34 | 159 | 6.8% | 164 | 29 |
| 2026 Q3 | 1,934 | 148 | 7 | 141 | 7.3% | 73 | 75 |

- Same step, same month. Claude trailers begin in May 2026 and pass Copilot's in the third quarter.
- The commit share (7%) is far below the pull request share (47%) because one marked pull request holds many commits and only some carry the trailer. Use the pull request figure on a slide; the commit figure undersells it and needs explaining.
- Do not use commit counts as a measure of activity. Counted over every branch they doubled (3,121 → 6,390, January to September); counted on default branches only they fell 8% (1,731 → 1,597). The difference is how pull requests are merged, not how much work was done.

Comments:

| Quarter | Review comments by people | Review comments by Copilot | People's comments carrying the attribution line |
|---|---|---|---|
| 2025 Q1 | 206 | 0 | 0 |
| 2025 Q2 | 254 | 22 | 0 |
| 2025 Q3 | 141 | 77 | 0 |
| 2025 Q4 | 109 | 63 | 0 |
| 2026 Q1 | 301 | 291 | 0 |
| 2026 Q2 | 313 | 451 | 7 |
| 2026 Q3 | 184 | 245 | 87 |

- Since April, Copilot has written more review comments than people have (696 against 497).
- People still review. The share of merged pull requests reviewed by a person other than the author was 83%, 84%, 89%, 85% through 2025 and 93%, 79%, 96% in 2026.

## Shape of the work

Measured cleanly:

| Quarter | Merged pull requests that add or change a test file | That add a new test file | Reviewed by another person | Median hours from open to merge | Median lines changed | Issues closed within 30 days |
|---|---|---|---|---|---|---|
| 2025 Q1 | 49 of 129 (38%) | 19% | 83% | 24 | 180 | 48% |
| 2025 Q2 | 58 of 138 (42%) | 17% | 84% | 47 | 182 | 46% |
| 2025 Q3 | 22 of 82 (27%) | 11% | 89% | 48 | 184 | 44% |
| 2025 Q4 | 27 of 61 (44%) | 25% | 85% | 29 | 218 | 49% |
| 2026 Q1 | 66 of 119 (55%) | 30% | 93% | 63 | 310 | 66% |
| 2026 Q2 | 88 of 148 (59%) | 35% | 79% | 25 | 480 | 60% |
| 2026 Q3 | 74 of 132 (56%) | 40% | 96% | 85 | 176 | 49% |

- Tests are the one shape measure that moved and stayed moved. January to September: 129 of 349 merged pull requests touched a test in 2025 (37%), 228 of 399 in 2026 (57%). Adding a brand-new test file: 16% → 35%. In the fixed set of 8: 32% → 58%.
- The rise in tests starts in January to March 2026, a quarter before the AI marks step up. It fits the team's test-first convention as much as it fits the agents.
- Time to merge did not fall. The medians wander between one and three and a half days, and the slowest quarter of the seven is the latest.
- Pull request size rose in the first half of 2026 and came back.
- Issues closed within 30 days rose in the first half of 2026 and came back. The 2026 Q3 figure covers issues opened up to 6 September only, so each has had its 30 days.

## The three visuals

`ai-adoption-visual.html` (press → to step through; N for notes) and the PNGs beside it. Each is one inline SVG, 560 × 300, nothing under 22px, shown bottom right on a stand-in slide. Teal is the deck's `--spec-3`; grey is its `--soft`.

- A, recommended (`ai-adoption-visual-a.png`): pull requests opened each quarter, 2025 Q1 to 2026 Q3, with the part that carries an AI agent's mark in teal. Here teal marks the agent's share, not the year.
  - Why this one: it is the single clearest true statement. It does not depend on a baseline, a window or a choice of repositories, and it shows the unflattering part in the same picture: the grey bars of early 2025 are nearly as tall.
  - What to say with it: "Since April, nearly half of our pull requests carry an agent's mark. A year ago almost none did."
- B (`ai-adoption-visual-b.png`): the hypothesis as a scorecard. April to September against the same months of 2025, five measures: +40%, +27%, +18%, −5%, −20%.
  - Fair because it shows the two measures that went the wrong way beside the three that went the right way.
  - Weak because the window leans on the 2025 slump. The speaker notes carry the before-April figures and the other repository sets.
- C (`ai-adoption-visual-c.png`): merged pull requests that touch a test, 2025 beside 2026, by quarter: 38% / 55%, 42% / 59%, 27% / 56%.
  - The only one about the kind of work rather than the amount.
  - Cannot be pinned on AI: it starts a quarter early.
- Each `on-slide` PNG shows the same visual at its real size on a 1600 × 900 slide.
- The titles on the stand-in slides are draft wording, like every other word.

## What would embarrass him on stage

- "Doubled", "+50% releases" or "record". None is supported. Releases are down about a fifth. The busiest quarter (171) beats late 2022 by one.
- "Up 82%" for July to September. True, and mostly a weak 2025 quarter.
- A causal claim. Early 2025 matched 2026's volume with almost no marks; the first quarter of 2026 was flat; the 2025 slump has no known cause here.
- "We adopted AI this year" said flatly. Copilot was reviewing a third of pull requests by late 2025. What started in April 2026 is agents writing the changes.
- Issues closed. He expected them up; since April they are down 5%, and the open backlog grew twice as fast as last year.
- Speed. Median time from open to merge has not improved.
- The repository choice. Anyone can re-cut it: +96% on one set, −22% on another.
- Copilot now writes more review comments than the people do. True, and easy to hear the wrong way; people still review 96% of merged pull requests.
- Presenting the marked share as the true share of AI use. It is a floor.

## What could not be measured

- Anything in a repository that is not public, including whether gsm.app and gsm.qc carried on elsewhere.
- AI use that leaves no mark: an agent's change committed without a trailer, in a pull request without the attribution line.
- Team size, hours, or who left and joined. Only accounts are visible.
- Output: whether the software is better, or reached users sooner.
- Why the second half of 2025 was quiet.
- Whether the tests that were added are good tests.
- October to December 2026.

## Method

- Repositories: the 25 of the earlier pass, unchanged. Each returned 200 without a login at 12:39 UTC. Each was also checked as not private in the fetch, and the search-API re-count below runs with no login at all, so it can only see public items.
- Issues, pull requests, releases: as in the earlier pass. Releases are published releases with a version-like tag. Dates are UTC. Nothing on or after 7 October 2026 is counted; quarters are whole calendar quarters.
- Bots: the account that opened the item is of type Bot (dependabot, github-actions, cm-operations-bot, ci-gh-app). Left out unless a line says "with bots". None of the four is an AI agent.
- Coding-agent accounts (Copilot coding agent, Claude, Codex, Devin, Jules, Cursor) were looked for separately. None opened an issue or pull request.
- Attribution line: the body has "drafted by" followed within 40 characters by the name of an AI tool. The convention is "This PR was drafted by … using … and reviewed by …". Every body containing "drafted by" since January 2025 matched; none was a false hit.
- Tool footer: "Generated with Claude Code" and similar.
- Agent co-authored commit: a non-merge commit with a `Co-authored-by:` trailer naming Claude or Copilot, read from full-history clones including pull request heads.
  - A Copilot suggestion accepted in the browser is counted apart and is not a mark: GitHub is the committer and the subject is the one GitHub writes ("Update <file>", "Apply suggestions from code review", "Potential fix for …"). 103 of the 519 trailers.
  - 95 commits authored by workflow bots carry a trailer copied from elsewhere; they are left out of both the count and the base.
- A pull request's commits are the ones GitHub lists for it. 896 of those are merge commits and carry no trailer; every other one was found in the clones.
- Test file: `tests/testthat/test-*.R`, or `*.test.js`, `*.spec.js`, or a `.js` file under `tests/` or `__tests__/`. Snapshots and fixtures are not test files.
- Percentages on the visuals are worked from the counts, never from an already rounded share. Halves round away from zero.
- No account names are written to any file here. The raw fetch, which holds them, stayed in the scratch folder.

## Commands, and when they ran

All on 2026-10-07, UTC. Read only: nothing was written to GitHub, and `keynote/slides.html` was only read. The scripts ran from a scratch folder and are copied here as a record; they expect `raw.json`, `commits.json`, `prcommits.json`, `tests.json` and `clones/` beside them.

1. 12:39:53. Public check: `curl -s -o /dev/null -w '%{http_code}' https://github.com/{org}/{repo}` for the 25. All 200.
2. 12:40:03 to 12:40:55. Clones, no credentials: `git clone --bare --filter=blob:none https://github.com/{org}/{repo}.git`, then `git fetch origin '+refs/pull/*/head:refs/pull/*/head'`.
3. 12:40:04 to 12:51:42. `node ai-adoption-fetch.mjs`: GraphQL for every issue and pull request (body, author, size, reviews), REST for releases and comments. 241 requests with the obot app's token, which reads public repositories only in these organisations and is used for the request allowance. One repository (gsm.viz) answered with an empty body and was fetched again at 12:49:30 with `node ai-adoption-fetch.mjs Gilead-Public/gsm.viz`.
4. 12:51:57 to 12:52:59. `node ai-adoption-fetch-prcommits.mjs`: the commit hashes of every pull request created since January 2025. 81 requests.
5. `node ai-adoption-commits.mjs` (trailers from `git log --all --no-merges`) and `node ai-adoption-tests.mjs` (`git log --all --no-merges --no-renames --diff-filter=AM --name-status`).
6. `node ai-adoption-analyze.mjs`: writes `ai-adoption-data.json` and prints every table (`ai-adoption-tables.txt`).
7. `node ai-adoption-build.mjs`, then `node ai-adoption-shot.cjs` (Playwright from safety.viz). The build stops with an error if the counts behind the words have moved. The shot script reports text under 22px, text outside the 560 × 300 box and overlaps; all three came back clean.

Second, independent counts:

- 12:54:12 to 12:59:20. `node ai-adoption-crosscheck.mjs`: every quarterly figure in the timing table, with and without bots, re-counted with the search API's `total_count` and no login. 56 of 56 match. Queries in `ai-adoption-crosscheck.json`.
- 13:06:17 to 13:07:19. `node ai-adoption-crosscheck-ai.mjs`: issues and pull requests with "drafted by" in the body, and pull requests reviewed by Copilot, by search with no login. 11 of 12 match; the twelfth is 39 by search against 38 counted for pull requests in 2026 Q3 (the search takes the bare phrase and keeps bot-opened items). Results in `ai-adoption-crosscheck-ai.json`.
- AI trailers a second way, with git's own search over the clones: `git log --all --no-merges -i -E --grep='^[[:space:]]*co-authored-by:.*(claude|copilot|anthropic)'`. 519 unique commits since January 2025, the same 519 the parser found.
- The January to 6 October totals reproduce the earlier pass exactly (491 → 594, 425 → 466, 403 → 484, 359 → 401, 60 → 47).
- The search API has no release counts. Release figures rest on the fetch alone.

## Caveats

- This is a before-and-after on one team. It cannot separate AI from everything else that changed: new repositories, the move to a new organisation in September, people joining and leaving, the conventions the team adopted alongside the agents.
- The repository mix changed between the years. Two cuts are fair (all 25, and the 8 worked on in both years); the rest are shown so nobody is surprised by them.
- An issue can be a typo or a quarter's work. Agents open issues cheaply, which is itself a reason to expect issue counts to rise without more being done.
- Marks depend on habits. The attribution line became a convention in 2026; a rise in marked items is partly a rise in marking.
- Deleted and transferred items, and a repository's past visibility, cannot be seen.
- UTC days. Numbers stop at 6 October.

## For Jeremy to confirm

- That "since April" is the right date to hang the comparison on. The public marks say April 2026. If he dates adoption differently, the before and after change with it.
- Whether Copilot reviewing pull requests through 2025 counts as "adopting AI" in his telling. If it does, the start is mid 2025, not this year.
- Whether gsm.app and gsm.qc stopped or moved out of public view. It decides how to read the repository sets.
- The phrase "carrying an AI agent's mark" and its definition (attribution line, tool footer, or co-authored commit; reviews and accepted suggestions left out).
- Whether to show volume at all. Candidate A shows it honestly; a slide that only says "+40%" needs the 2025 slump said aloud.
- Whether to name the tools. The record can: Copilot first, Claude Code from mid 2026, Posit Assistant in the third quarter.
- Team size in each year, which only he knows.
- The repository list (unchanged from the earlier pass: qcthat in, two unrelated public repositories out).
- Re-run the week of the talk; the build script will refuse to write stale words.

## Files

- `ai-adoption-findings.md`: this file.
- `ai-adoption-data.json`: every number above, by quarter, by month, by repository set and by repository. Aggregate only.
- `ai-adoption-tables.txt`: the analysis script's full printed output, including the with-bots variants.
- `ai-adoption-visual.html`, `ai-adoption-visual-{a,b,c}.png`, `ai-adoption-visual-{a,b,c}-on-slide.png`.
- `ai-adoption-crosscheck.json`, `ai-adoption-crosscheck-ai.json`: the second counts.
- Scripts: `ai-adoption-repos.mjs`, `-fetch.mjs`, `-fetch-prcommits.mjs`, `-commits.mjs`, `-tests.mjs`, `-analyze.mjs`, `-crosscheck.mjs`, `-crosscheck-ai.mjs`, `-build.mjs`, `-shot.cjs`.

---

Drafted by Claude Code using Opus 5.5, for review by @jwildfire.
