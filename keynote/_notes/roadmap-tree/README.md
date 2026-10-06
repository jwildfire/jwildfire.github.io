# Roadmap tree: the generator behind two beat 4 slides

Draws the obot roadmap (objectives, requirements, tasks) as two static SVG pictures with a date stamp, for the slides in `../beat4-roadmap-tree-draft.html`:

- Slide A, a treemap of every objective.
- Slide B, one objective (Biomarker charts) as a tree: its requirements, and one bead per task.

The pictures are snapshots. Nothing on the slides runs or fetches anything; refresh them with the two commands below.

## Refresh before the talk

From this folder, with Node 20 or later:

```bash
cd ~/Documents/github/jwildfire.github.io/.claude/worktrees/keynote-deck/keynote/_notes/roadmap-tree

# 1. Read GitHub and save a trimmed snapshot (model.json). Needs a token for this one command.
GITHUB_TOKEN="$(gh auth token)" node fetch.mjs

# 2. Redraw both pictures, the captions and the counts in the speaker notes.
node build.mjs --inject ../beat4-roadmap-tree-draft.html
```

- Once the two slides have been copied into the deck, point step 2 at the deck as well: `node build.mjs --inject ../../slides.html`. It only works if the slides were copied with their `roadmap-tree:…:start` and `:end` comment markers; `--inject` may be given more than once.
- The date on the slides is the day of step 1, in Eastern time. Step 2 alone redraws from the saved snapshot and keeps its date.
- Then open the slide and look at it. The numbers in the notes are rewritten; the sentences around them are not, so check the talking points against the new picture.

### About the token

- `fetch.mjs` reads `GITHUB_TOKEN` (or `GH_TOKEN`) from the environment of that one command and writes it nowhere. Any token that can read public repositories works.
- At a terminal, `gh auth token` supplies it, as above.
- An agent session in the obot2 workspace cannot use that form (a hook refuses it); it mints the obot app's token instead: `GITHUB_TOKEN="$(/Users/jwildfire/Documents/obot2/obot.agent/scripts/obot-app-token)" node fetch.mjs`.
- Never paste a token into this folder, a command saved in a file, or a commit.

## What the build tells you

Read the console after step 2. It prints the counts, and it flags what did not fit:

- `drawn larger than their task count` lists the objectives given the minimum block size so their names fit (see below).
- `NO ROOM for a name on` means an objective block could not take its name at 18px.
- `CUT SHORT` means a requirement title on slide B was truncated.
- A line starting `!` means the legend or the rows have outgrown the slide.

`counts.md` is rewritten each run with the same counts and with every piece of text that is readable on either slide, so the wording can be checked before it is shown.

## Options

| Option | Effect |
|---|---|
| `--objective 353` | The objective slide B opens up. 353 is Biomarker charts. |
| `--orphans` | Also draw the requirements filed under no objective, as one dashed block. |
| `--retired` | Also draw retired requirements, hatched. |
| `--no-floor` | Size every objective strictly by its tasks, even if its name then has no room. |
| `--keep 20` | On slide A, also write a requirement title that has been cut, if at least 20 characters survive. By default only a title that fits whole is written, which today is none. |

## How it works

- `fetch.mjs` imports the hub tracker's own collector from a local checkout (`/Users/jwildfire/Documents/obot2/obot.roadmap/scripts/lib/collect/tracker.mjs`; set `OBOT_ROADMAP` to use another checkout). A requirement's status and a task's state are therefore exactly what [the tracker page](https://jwildfire.github.io/obot.roadmap/tracker.html) shows. It keeps issue numbers, titles and statuses for objectives and requirements, and only a state for each task.
- `build.mjs` lays both pictures out and fits the text using `font-widths.json`, the measured character widths of Instrument Sans (the deck's body font). No browser and no packages are needed.
- Colours are the tracker's status colours; they are listed in `../beat4-roadmap-tree-sources.md`.
- Nothing meant to be read is written under 18px at the slide's 1600px width. A label that does not fit at 18px is left out, not shrunk.

## Rules the pictures follow

- Size on the treemap: one unit of area per task, and one unit for a requirement with no tasks yet, so it still shows.
- The exception: an objective with fewer than seven units is drawn at seven, in a column on the right, so that its name fits. The build names each one.
- An objective's block is neutral grey, because the roadmap gives an objective no status of its own. The bar beside its name is the share of its requirements in each status.
- A task wears the colour of the status it most resembles: done is the released green, an open pull request is the review plum, open is the backlog tint, closed as not planned is the hatched slate.
- Retired requirements and requirements under no objective are left out unless asked for, and the caption says how many.

## Files

| File | What it is |
|---|---|
| `fetch.mjs` | Step 1. Writes `model.json`. |
| `build.mjs` | Step 2. Writes `treemap.svg`, `node-link.svg`, `counts.md`, and injects into the files named with `--inject`. |
| `model.json` | The trimmed snapshot: public issue numbers, titles and statuses. |
| `font-widths.json` | Character widths of Instrument Sans at weights 400 and 600, in em. Only needs redoing if the deck's body font changes. |
| `treemap.svg`, `node-link.svg` | The two pictures as standalone files, the same as the ones in the slides. |
| `counts.md` | The counts and the readable text of the last build. |
