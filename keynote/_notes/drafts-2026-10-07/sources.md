# Slide visuals drafted 2026-10-07: sources

Three first drafts for slides 10, 13 and 22 of `keynote/slides.html`. None is in the deck. Every word on them is draft wording for Jeremy to replace or cut; this file records where each fact and number came from, and what he still has to confirm.

## Files

| File | What it is |
|---|---|
| `slide10-visual.html`, `slide10-visual.png` | Slide 10 with a commits-by-year chart under the three columns |
| `slide13-openrbqm.html`, `slide13-openrbqm.png` | Slide 13: the packages, the six steps, the collaboration |
| `slide22-ops.html` | Slide 22, two options (slide 1 of the file is option B, slide 2 is option A) |
| `slide22-ops-option-b.png` | Option B: a six-row mock schedule replaces the two cards |
| `slide22-ops-option-a.png` | Option A: the cards stay, a three-row mock strip replaces the TODO box |

- Each HTML file is the deck's own stylesheet and script (copied from `slides.html` on 2026-10-07, asset paths re-pointed to `../../assets/`) around one or two `<section>` elements.
- In each file the new CSS sits between `BEGIN style` and `END style` comments and the section between `BEGIN replacement section` and `END replacement section` comments.
- None of the sections uses an image, so no path changes when a section is pasted into the deck.
- The PNGs are 1600 x 900, taken with headless Chromium (Playwright from the safety.viz checkout) on the `file://` page.
- Text sizes: every piece of new text is 22 px or larger at 1600 x 900. The exceptions are parts of the deck reused unchanged on slide 22: the Operations pillar (16 to 21 px) and, in option A only, the two cards (17 and 21 px).

## Slide 10: commits by year

### What was counted

Commits per calendar year, by author date, merge commits included, on the default branch of four repositories.

| Repository on GitHub | Branch | Local clone | Tip (short hash, date) | Commits |
|---|---|---|---|---|
| SafetyGraphics/safetyGraphics | `dev` (the default) | `obot2/safetyGraphics`, ref `origin/dev` | `87f180e`, 2023-09-14 | 1,167 |
| SafetyGraphics/safetyCharts | `dev` (the default) | `obot2/safetyCharts`, ref `origin/dev` | `65190c6`, 2024-09-20 | 232 |
| SafetyGraphics/hep-explorer | `master` (the default) | `obot2/hep-explorer`, ref `origin/master` | `1388a1e`, 2022-02-25 | 455 |
| RhoInc/safety-histogram | `master` | `obot2/safety-histogram`, ref `origin/master` | `039ab8c`, 2020-01-20 | 231 |

- All four clones have full history (`git rev-parse --is-shallow-repository` prints `false` in each).
- The local refs were checked against GitHub on 2026-10-07 with `git ls-remote origin refs/heads/<branch>`; all matched. For safety-histogram the clone's `origin` is the archived fork `obot-claw/safety-histogram`, so its `master` was compared with `git ls-remote https://github.com/RhoInc/safety-histogram.git`: the same commit, `039ab8c`.
- The clones' checked-out branches were not counted. Three of them are 2026 working branches from this project (`remove-tendril` in safetyGraphics and safetyCharts, `p004-nextgen-chartjs-histogram` in safety-histogram) and would add 2026 commits that are not upstream.

### The numbers

| Year | safetyGraphics | safetyCharts | hep-explorer | safety-histogram | On the slide |
|---|---|---|---|---|---|
| 2016 | | | | 35 | 35 |
| 2017 | | | | 47 | 47 |
| 2018 | 179 | | 264 | 48 | 491 |
| 2019 | 544 | | 164 | 99 | 807 |
| 2020 | 104 | 55 | 8 | 2 | 169 |
| 2021 | 261 | 87 | 11 | | 359 |
| 2022 | 51 | 37 | 8 | | 96 |
| 2023 | 28 | 51 | | | 79 |
| 2024 | | 2 | | | 2 |
| 2025 | | | | | 0 |
| Total | 1,167 | 232 | 455 | 231 | 2,085 |

Command, run in `/Users/jwildfire/Documents/obot2` (one line per repository, then summed):

```sh
git -C safetyGraphics   log --format=%ad --date=format:%Y origin/dev    | sort | uniq -c
git -C safetyCharts     log --format=%ad --date=format:%Y origin/dev    | sort | uniq -c
git -C hep-explorer     log --format=%ad --date=format:%Y origin/master | sort | uniq -c
git -C safety-histogram log --format=%ad --date=format:%Y origin/master | sort | uniq -c
```

- Counting by committer date (`%cd`) gives the same ten totals.
- Leaving merge commits out (`--no-merges`) gives 31, 35, 404, 608, 142, 276, 69, 51, 1, 0. The shape is the same. The slide uses the count with merges because that is the number GitHub shows on a repository's page.
- 2026 is not on the chart. Upstream it is also zero on all four default branches as of 2026-10-07 (the tips above are the newest commits).

### Things the chart does not show

- One commit dated 2025-04-09 is on a side branch of safetyCharts (`origin/fix-153`, `b6eeac6`). It is not on the default branch, so 2025 reads 0.
- safetyGraphics' last release tag is v2.1.1, 2022-12-14 (`git -C safetyGraphics tag --sort=creatordate`); v2.0.0 is 2021-09-22.
- The 96 and 79 commits of 2022 and 2023 are not nothing: 58 of safetyGraphics' 79 commits after 2021 are Jeremy's own (`git -C safetyGraphics log --since=2022-01-01 --format=%an origin/dev | sort | uniq -c`: "Jeremy Wildfire" 47, "jwildfire" 11, "Spencer Childress" 20, "Xiao Ni" 1). "Going quiet" is fair for 2024 and 2025; for 2022 and 2023 it is "slowing".
- These are four of the project's repositories. The other renderers (the "other 8 RhoInc renderer forks" in the workspace notes) are not cloned locally and were not counted.
- The 2024 bar is drawn 2 px high so that it can be seen. At the chart's scale (120 px for 807 commits) two commits would be 0.3 px.

### Draft wording, and what Jeremy has to confirm

- "Commits a year, four repositories": draft.
- "After I moved to Gilead, in 2021": draft wording. The fact is diary #3 (`_posts/2026-06-16-reintroducing-safetygraphics.md`, "A Few Quiet Years"): "I stopped active work on `{safetyGraphics}` when I moved to Gilead in 2021 and started working on RBQM." Jeremy to say whether he wants the move named on the slide. The bracket sits over 2022 to 2025; the 2021 bar (359, the year of v2.0.0) is left outside it.
- The three columns' words are unchanged. Their padding is tighter (the rules under `.s-quiet`), so the third column now wraps differently.
- Whether "four repositories" is the right set, or the chart should be safetyGraphics alone (2018: 179, 2019: 544, 2020: 104, 2021: 261, 2022: 51, 2023: 28, then nothing).

### Chart choices

- One series, so one hue (the slide's amber) and no legend; every bar carries its count as text.
- One axis, starting at zero; no gridlines, because every bar is labelled.
- Each bar has a hover title with the split by repository.

## Slide 13: how OpenRBQM works

Public sources only, all read on 2026-10-07.

| On the slide | Source |
|---|---|
| The row Study data → gsm.mapping → gsm.kri → gsm.reporting → Reports | https://openrbqm.github.io/packages.html, "How the packages fit together": raw / source datasets → gsm.mapping ("map to domains") → gsm.kri ("generate & visualize metrics") → gsm.reporting ("reporting data model") → Reports |
| "maps it to standard domains" | Same page, "Package roles": "Workflows that transform raw/source datasets into the appropriate domains." "Standard" is from `.github/AGENTS.md` ("standardized analysis domains") |
| "calculates and charts the metrics" | Same table: "Workflows to generate metrics, plus functionality to visualize and report on them." |
| "the reporting data model" | Same table: "Workflows to build the reporting data model needed to generate reports." |
| "Reports for each site and country" | https://openrbqm.github.io/help.html lists a Site KRI Report and a Country KRI Report among the sample reports (also an eligibility, a cross-study and a QTL report, not named on the slide) |
| "workr runs every step from a YAML workflow" | Same table: "Workflow runtime that executes YAML-defined steps and workflows." |
| "the statistics come from gsm.core" | Same page: "{gsm.core} provides the analytics used to construct and evaluate the metrics." |
| The six step names | The gsm.core README, https://github.com/Gilead-Public/gsm.core (fetched from `raw.githubusercontent.com/Gilead-Public/gsm.core/main/README.md`): "All {gsm.core} assessments use a standardized 6 step data pipeline", then Input_Rate, Transform, Analyze, Threshold, Flag, Summarize. Also `.github/AGENTS.md`: "Input → Transform → Analyze → Threshold → Flag → Summarize" |
| "24 packages" | https://openrbqm.github.io/packages.html: 5 core, 8 extensions and data, 5 apps and plugins, 3 quality, 3 additional. The deprecated `gsm` is left out |
| "from Gilead, the IMPALA Consortium and the OpenRBQM organisation" | The GitHub links on that page: 16 of the 24 under Gilead-Public or Gilead-BioStats; 4 under IMPALA-Consortium (gsm.simaerep, gsm.simaerep.viz, gsm.studykri, gsm.timez); 4 under OpenRBQM (gsm.ae, gsm.digitpref, gsm.pd, gsm.query) |
| "A PHUSE pre-competitive collaboration" | https://openrbqm.github.io: "a PHUSE pre-competitive collaboration" |
| "project leads from Roche and Gilead" | The PHUSE page the site links to, https://advance.hub.phuse.global/wiki/spaces/WEL/pages/26811224/ : project leads Jeremy Howells (Roche), Jeremy Wildfire (Gilead), Natalia Andriychuk (Gilead) |

### Reused from the slide cut on 2 October

- Found with `git log --all -S"same six steps"` in the worktree: added in commit `4cba5b2` (2026-10-02), gone by `fcb2993` (2026-10-06). Read with `git show 4cba5b2:keynote/slides.html`.
- Kept: the six numbered hexes in a row, and its one-line descriptions under each step.
- Changed: its title had an italic, coloured "six steps"; the new slide's title is plain. The hexes are smaller. The first description was "study data, mapped to standard domains" and is now "the mapped study data", because mapping is its own box on this slide.

### Draft wording, and what Jeremy has to confirm

- The headline "How OpenRBQM works" is draft. The placeholder's "OpenRBQM, in more detail" was a stand-in.
- The six descriptions (a rate for each site, a statistical score, the limits for that score, sites outside the limits, one row per site per metric) are the cut slide's paraphrases, not the README's words. The README only says each step converts one table into the next. Jeremy to check each.
- Hanging the six steps off gsm.kri is my reading: gsm.kri holds the metric workflows and gsm.core the functions they call. The README says the steps belong to "all {gsm.core} assessments". Jeremy to say whether the panel should hang off gsm.kri, gsm.core, or neither.
- Who is in the collaboration. No public page found lists member companies. The slide names only what the two pages above show: Roche and Gilead as project leads, and the IMPALA Consortium as a home for four packages. Naming the IMPALA Consortium next to the others implies it is part of the collaboration; that is an inference from where the repositories live. Jeremy to confirm, and to add anyone else who can be named.
- "24 packages" will drift as the site changes; two of the 24 are JavaScript libraries (gsm.viz, gsm.simaerep.viz), so the slide does not say "R packages".

### Not done, and why

- No package hex logos. `keynote/assets/hex/` has qcthat, testthat, forcats and safetyGraphics, none of them one of the five packages in the row, and the local gsm.kri and gsm.qtl clones hold no logo files.
- No screenshot. Slide 12 already shows the gsm.kri report; a second one here would repeat it.
- qcthat, gsm.qtl and gsm.viz are not named: slide 15 is about qcthat and GxP evidence, and the row is the site's own five-package picture.

## Slide 22: study operations, mock data

- Everything in the schedule is invented for the slide: the study names MOCK-101 to MOCK-106, the eight weeks, which snapshots have run, the two- and four-week cadences, and which study is flagged. The slide carries a "Mock data" label, and the study names say so too.
- No internal screenshot or document was opened for this draft. Nothing in it describes a real study, date, count or tool.
- The ideas it draws are the ones already on slide 22 and on slides 20 and 23: one repo per study; one schedule for every study; issues opened by the schedule; a weekly check against each study's monitoring plan. No new fact about the day job is added.
- The legend line in option B, "Each hex is an issue the schedule opened in that study's repo", restates the card line "Issues, opened by the schedule" together with slide 23's "Merge a schedule, and issues open in each study repo".

### The two options

- Option B (recommended; slide 1 of the file): the schedule replaces the two cards and the TODO box. Six mock study repos, eight weeks, a "today" line, a plan-check column with one study flagged. Four card lines leave the slide and are in its notes for saying: each repo's own configuration and snapshot workflow ("one of 20"), and the hub's dashboard, request forms and 15-step set-up guide.
- Option A (slide 2 of the file): the cards stay, with tighter padding, and a three-row strip of the same schedule replaces the TODO box. Nothing leaves the slide, but it is dense.

### Draft wording, and what Jeremy has to confirm

- "Plan check", "OK", "Flagged", "snapshot run", "scheduled", "today", "Study repo" and the legend line are all draft.
- What a flag from the monitoring-plan check means is not said on the slide and was not invented. Jeremy to say it, or to cut the column.
- Whether mixed cadences (some studies every two weeks, some every four) are a fair mock, or all rows should share one cadence.
- Whether to replace the mock rows with something real that is cleared for a public talk.
- The lead line above the picture ("One repo per study, one hub to run them") is the deck's own; it was raised from 20 px to 22 px on this slide only.

### Chart choices

- Teal (the slide's hue) for snapshots: filled for run, outlined for scheduled, so the two differ by shape of mark and not by hue.
- The flagged study uses the deck's muted red with an exclamation mark and the word "Flagged", so the state is never carried by colour alone.
- Every mark has a hover title (study, week, state).

## How these were built

- The HTML files were written by three small Python scripts kept in the session's scratch folder, not in the repository. Each copies the `<head>` of `keynote/slides.html`, re-points `url(assets/…)` to `url(../../assets/…)`, and appends the section and the deck's script.
- `keynote/slides.html` was read and not edited.
