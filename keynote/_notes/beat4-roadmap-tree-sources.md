# Beat 4 roadmap tree: sources

Draft of 2026-10-05 for the two slides in `beat4-roadmap-tree-draft.html` ("The whole roadmap is one tree of GitHub issues" and "An objective becomes requirements, then tasks"). Not in the deck yet. The headlines and kickers are draft wording for Jeremy to replace; this file is the record of what the pictures show and where the numbers came from.

## The snapshot

- Taken 5 October 2026 at 21:23 Eastern (2026-10-06 01:23 UTC).
- Source: the issues of [jwildfire/obot.roadmap](https://github.com/jwildfire/obot.roadmap) and the task issues linked under them, read through the hub tracker's own collector (`scripts/lib/collect/tracker.mjs`). The statuses are the ones [the tracker page](https://jwildfire.github.io/obot.roadmap/tracker.html) shows.
- Generator and refresh commands: `roadmap-tree/README.md`. The saved snapshot is `roadmap-tree/model.json`; `roadmap-tree/counts.md` is rewritten on every build.
- The roadmap moved while this was being drafted. That evening the deployed tracker page showed 175 requirements, a read at 20:46 gave 176 and this snapshot at 21:23 gave 177, as two new biomarker requirements went into session. The slides carry a date for that reason.

## Counts on the snapshot

On the hub in all:

- 10 objectives, all open.
- 177 requirements: 66 released, 7 in review, 2 in session, 3 ready, 55 backlog, 44 retired.
- 274 tasks: 225 done, 2 in review, 45 open, 2 retired.
- 25 requirements sit under no objective.

Drawn on slide A (the treemap):

- 10 objectives, 108 requirements, 155 tasks.
- Requirements: 52 released, 4 in review, 2 in session, 3 ready, 47 backlog.
- Tasks: 124 done, 1 in review, 29 open, 1 retired.
- Not drawn: 44 retired requirements and the 25 with no objective. The caption says so.

Drawn on slide B (the tree):

- One objective, Biomarker charts, with 14 requirements (12 released, 2 in session) and 44 tasks (38 done, 1 in review, 5 open).
- Nothing is hidden on this slide; the objective has no retired requirements.

Per objective, as drawn on slide A:

| Objective | Requirements drawn | Tasks |
|---|---|---|
| Chart coverage | 34 | 43 |
| Increased autonomy in obot.agent | 34 (43 more are retired and not drawn) | 46 under the 34 drawn; 115 in all |
| Biomarker charts | 14 | 44 |
| Data loading and mapping | 5 | 8 |
| open.csr | 5 (1 more is retired) | 6 |
| Portfolio view | 5 | 4 |
| Program operations | 3 | 4 |
| A local-only desktop tool | 3 | 0 |
| R/Pharma 2026 keynote deck | 3 | 0 |
| Static parity | 2 | 0 |

## Status colours

These are the tracker's colours (`.tk-sw.*` in the hub's `site/assets/styles.css`), not the deck's. One legend serves requirements and tasks.

| Colour | Hex | On a requirement | On a task |
|---|---|---|---|
| Green | `#86efac` | Released: closed with its release | Done: closed by its pull request |
| Dark plum | `#6c3270` | Review: a release candidate is waiting on Jeremy | In review: open, with an open pull request |
| Mid plum | `#a367a4` | In session: an agent session is working it | not used |
| Light plum | `#d3aed3` | Ready: designed, tasks filed, signed off, not started | not used |
| Palest tint | `#efe4ef` | Backlog: filed, not yet ready | Open: not started or in progress, no pull request yet |
| Slate, hatched | `#cbd5e1` with `#94a3b8` lines | Retired: closed as not planned (hidden by default) | Retired: closed as not planned |
| Neutral grey | `#f3f4f1` | An objective's block | |

- The hatch on retired is added here, because slate and the released green are close on a projector. The colours themselves are unchanged.
- A requirement with no status label would be drawn salmon (`#fca5a5`); there is none on this snapshot.

## How the marks are coloured and sized

- An objective has no status of its own on the roadmap, so its block is neutral grey. The bar beside its name is one segment per status, as wide as that status's share of the objective's requirements.
- A requirement is a framed box (slide A) or a square (slide B) in its status colour.
- A task is a cell inside its requirement (slide A) or a bead after it (slide B), in the colour of the status it most resembles.
- Slide A area: one unit per task, and one unit for a requirement with no tasks, so it still shows.
- Slide A exception: four objectives with fewer than seven units are drawn at seven, in the right-hand column, so that their names fit at 18px. They are Static parity (2 units), A local-only desktop tool (3), R/Pharma 2026 keynote deck (3) and Program operations (5). Every other block is to scale. `--no-floor` turns this off, and the names then do not fit.
- Text: nothing under 18px at 1600 wide. Objective names are 18 to 20px on slide A and 28px on slide B, requirement titles on slide B are 19px, the counts are 18px, the legend is 20px, the caption is 20px mono.
- Slide A names no requirement. No requirement title fits whole in its box at 18px, and cut titles were dropped.
- Slide B names every requirement in full and no task.

## What is hidden, and why

- Retired requirements (44): 43 belong to the autonomy objective, the experiment shut down in September, and 1 to open.csr. Drawing them would more than double that block with work that was cancelled.
- Requirements under no objective (25): 14 released before the tree existed, 8 backlog, 3 in review. They are on the hub but not on the tree, so a picture of the tree leaves them out. `--orphans` draws them as one dashed block.
- Task names on both slides, and requirement titles on slide A, for legibility.

## Oddities in the data

Only the first three could mislead someone reading the slides.

- Six backlog requirements have every task under them closed (hub issues 33, 43 and 161 under Chart coverage, 123 and 260 under autonomy, 129 under open.csr). On slide A they are pale boxes full of green cells. The work is done; the status label was not moved.
- The three requirements in review that have no objective are the open.csr v0.4.0 requirements (hub issues 319, 320, 321). Because they are not linked to the open.csr objective, its block on slide A looks almost untouched when a release candidate is in fact waiting.
- The autonomy objective is still open although the hub's own contract says it was to be closed as retired. It is the largest block on slide A even with its 43 retired requirements hidden.
- Three requirements are linked under another requirement, not under an objective (hub issues 131, 241, 306). The tracker counts each once as a requirement with no objective and once as a task of its parent, so the task totals include three issues that are not tasks.
- Eight retired requirements under the autonomy objective still have 15 open tasks. They are not drawn.
- 88 requirements have no tasks linked: 40 backlog, 25 retired, 22 released and 1 in review.
- The deployed tracker page is rebuilt daily and on a push, so it can be a build behind a fresh read. On the evening of the snapshot it showed 175 requirements and 266 tasks.

## Wording check

Text readable on the slides, from `roadmap-tree/counts.md`:

- Slide A: the ten objective names and the legend. No requirement or task title.
- Slide B: "Biomarker charts", the 14 requirement titles under it, the legend and the counts. The titles name the public packages bio.viz, gsm.bio and safety.viz, and R. None names a person, an employer or an internal tool.
- The objective's public name is "Biomarker charts"; that is the only name used for it in the pictures, the notes and this folder.
- `model.json` holds every requirement title on the hub, including ones not shown on a slide. All are public issue titles. A few of those name the RhoInc GitHub organisation, the @jwildfire handle, or Claude products.
