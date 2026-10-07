# Demo fallback video

A recording of the keynote's live demo (slide 46, "Draft demo script"), to play if the
live demo fails on stage. It is the released safety.viz demo app doing real things on
its own public sample data: nothing is mocked up and no result is edited.

Recorded 2026-10-07. Nothing here is committed or published. The folder is about 58 MB.

## What is here

Two takes of the same demo, on two of the app's own sample studies. The draft script
cannot be followed to the letter on either one (see "Differences from the draft
script"), so both are recorded and the choice is Jeremy's.

- Take A, the pilot study: `demo-fallback-pilot.mp4` (1:50, 11 MB) and `.webm`
  - Four CSVs with standard column names, 364 participants in the labs file.
  - The charts are full: 318 participants in the hepatic explorer, 28 in the possible
    Hy's Law range.
  - Every guess the app makes is right, so nothing is fixed.
- Take B, the renamed-column study: `demo-fallback-renamed.mp4` (2:06, 10 MB) and `.webm`
  - Three CSVs and one JSON file with non-standard names, 24 participants.
  - Two mapping rows are set by hand, and the hepatic explorer goes from "2 missing" to
    ready.
  - The charts are sparse: 24 points, all in the normal range.
- Both videos are 1600x900 at 25 frames a second. The `.mp4` is H.264, yuv420p, with
  no sound; the `.webm` is what Playwright wrote (VP8).
- `record.mjs`: the script that made them. Paths and settings are at the top.
- `run-pilot.json`, `run-renamed.json`: what each run saw. Step times, the checks'
  readings, every network request, every console line.
- `steps/pilot/`, `steps/renamed/`: a screenshot at each step, taken during the run.
- `frames/pilot/`, `frames/renamed/`: a frame from the finished video every 10 seconds.
- `input/`: the exact files used (see "Input files").

## App version

- safety.viz 1.9.2, the single-file build, 1,436,502 bytes.
- Downloaded on 2026-10-07 from
  [jwildfire.github.io/safety.viz/demo/safety.viz-app.html](https://jwildfire.github.io/safety.viz/demo/safety.viz-app.html)
  (the server's last-modified time: 2026-10-07 11:39 GMT). Kept as
  `input/safety.viz-app.html`, sha256 `f5196bcd…7af37e`.
- How the version was confirmed:
  - The app's own footer reads "safety.viz 1.9.2"; the script reads it and stops if it
    is not a version. It is on screen in the first seconds of both videos.
  - The local clone has the tag `v1.9.2` (commit `45df8db`, 2026-10-07), and
    [NEWS.md](https://github.com/jwildfire/safety.viz/blob/main/NEWS.md) gives the
    single file as 1.4 MB for that release, up from 1.2 MB.
  - Not done: rebuilding the file from the tag to compare bytes. That would write into
    the safety.viz clone.
- The brief for this recording said v1.9.1. v1.9.2 was released the same day, and the
  published file is v1.9.2, so that is what was recorded.

## Offline or live

Offline. Both takes open the single file from `file://` in a browser context with the
network switched off.

- Requests made during each run: one, for the file itself. No other request, no failed
  request, no web socket. The lists are in each `run-*.json` under `network`.
- After the last step the script asks the page to fetch the public site once, to show
  the network really was off. Both times it was refused:
  `net::ERR_INTERNET_DISCONNECTED`. That request is kept apart from the demo's own.
- The footer on screen says it too: "This file loads nothing; files you add are read
  here and never leave this computer."

## Input files

All public sample data from the safety.viz repository at tag `v1.9.2`. Each file is
byte for byte the copy the public demo serves (sha256 compared on 2026-10-07).

- Take A, `input/pilot/`: `adsl.csv` (254 rows), `adae.csv` (1,159), `adbds.csv`
  (57,929), `adeg.csv` (5,361)
  - From `site/data/` in the repository; served at
    [jwildfire.github.io/safety.viz/demo/](https://jwildfire.github.io/safety.viz/demo/)
    as the app's "Pilot study".
  - It is [pharmaverseadam](https://github.com/pharmaverse/pharmaverseadam), the
    pharmaverse test data derived from the CDISC pilot study (Apache-2.0). The labs
    file also carries 110 synthetic liver and kidney participants who are in no other
    file.
- Take B, `input/renamed/`: `dm.csv` (24 rows), `ae.csv` (136), `labs_final.csv`
  (2,223), `ecg.json` (516)
  - From `tests/e2e/fixtures/app/` in the repository; served under `demo/renamed/` as
    the app's "Renamed columns" study.
  - 24 of the pilot participants, with the columns and measures renamed by
    `scripts/build-app-fixture.mjs`.
- The sha256 of every file is in each `run-*.json` under `inputs`.

## Steps and times

Times are positions in the video. They move by a few tenths of a second between runs;
the current ones are in `run-*.json` (`steps[].video`).

### Take A, the pilot study (1:50)

| Time | Step | What is on screen |
| --- | --- | --- |
| 0:00 | Open | The single file, empty: "Drop CSV or JSON files here". The pointer goes to the footer: "This file loads nothing…", "safety.viz 1.9.2". |
| 0:09 | Drag | Four CSVs are carried to the drop zone, which lights up. |
| 0:13 | Loaded | Each file is placed in a domain. Sidebar: "4 files loaded", "4 guessed, 0 needed by a chart", "18 of 18 charts ready". |
| 0:17 | Tabs | The pointer passes the tabs: Labs and vitals 9 of 9, ECG 1 of 1, Adverse events 3 of 3, Biomarkers 5 of 5. |
| 0:25 | Mapping | The pointer rests on "4 guessed", then clicks `adbds.csv` in the loaded-data list. |
| 0:32 | Guesses | The four guessed rows: ALT, AST, total bilirubin and alkaline phosphatase, each labelled "guessed". None is changed. |
| 0:47 | Labs tab | The Labs and vitals tab opens on the Histogram. |
| 0:52 | Hepatic Explorer | 318 of 364 participants. |
| 0:58 | Hover | The tooltip for participant 01-705-1186: ALT 3.25 xULN, bilirubin 5.94 xULN. |
| 1:03 | Click | The participant is selected: the visit path is drawn and the profile opens beside the chart. |
| 1:14 | Profile | Further down the profile: each measure with its range and a sparkline. |
| 1:22 | Biomarkers tab | The group comparison: 28 tiles, one per biomarker, a line per arm. |
| 1:29 | A biomarker | The Alanine Aminotransferase tile opens it across the ten visits. |
| 1:37 | A visit | Week 6 opens alone, a box per arm. |
| 1:44 | Second chart | The association scatter, held to the end. |

### Take B, the renamed-column study (2:06)

| Time | Step | What is on screen |
| --- | --- | --- |
| 0:00 | Open | As take A. |
| 0:09 | Drag | Three CSVs and a JSON file are carried to the drop zone. |
| 0:13 | Loaded | Sidebar: "23 guessed, 6 needed by a chart", "12 of 18 charts ready". Three tabs are marked red. |
| 0:17 | Tabs | Labs and vitals 6 of 9, ECG 0 of 1, Adverse events 1 of 3, Biomarkers 5 of 5. |
| 0:25 | Mapping | The pointer rests on "23 guessed, 6 needed", then clicks `labs_final.csv`. |
| 0:30 | A guess | Participant is `SUBJID`, labelled "guessed". |
| 0:35 | Fix 1 | Upper limit of normal is "not mapped", "needed by 3 charts". It is set to `ULN` and reads "chosen" (0:41). Sidebar: 13 of 18. |
| 0:46 | Fix 2 | Total bilirubin is "not in this data", "needed by 1 chart". It is set to "Tot. Bilirubin" and reads "chosen" (0:53). Sidebar: 14 of 18. |
| 1:04 | Labs tab | Opens on the Histogram. The Hepatic Explorer chip now reads ready. |
| 1:09 | Hepatic Explorer | 24 of 24 participants. |
| 1:15 | Hover | The tooltip for participant 01-701-1239. |
| 1:20 | Click | The visit path and the profile beside the chart. |
| 1:30 | Profile | Further down the profile. |
| 1:38 | Biomarkers tab | The group comparison: 10 tiles. |
| 1:45 | A biomarker | ALT (SGPT) across the visits. |
| 1:53 | A visit | Week 6 alone. |
| 2:00 | Second chart | The association scatter, held to the end. |

## Differences from the draft script

The draft: open the single file from the desktop with wifi off; drop four CSVs; show
one guessed mapping and fix it; open the hepatic explorer and click a participant; open
the Biomarkers tab. About two minutes.

- "From the desktop with wifi off" is true and cannot be seen.
  - The video is the page only: no desktop, no address bar, no wifi icon.
  - The file is opened from `file://` with the network off, and the run's request log
    shows it. On screen, only the footer's sentence says so.
- "Drop four CSVs" is four CSVs in take A, and three CSVs and a JSON file in take B.
  - The app's renamed-column sample has its ECG data as JSON.
- The drop is a real drop event, and the drag before it is drawn.
  - An operating-system drag cannot be recorded. The script hands the drop zone a real
    `drop` event carrying real File objects made from the files' bytes, which is the
    path a hand-dropped file takes in the app (and how the app's own test does it).
  - The list of file names beside the pointer is drawn by the script, not by the app.
  - After the drop the script reads the page and checks every file is listed, placed,
    and shown with the number of rows the file holds.
- "Show one guessed mapping and fix it" does not happen as written, on either study.
  - No guess the app makes on its sample data is wrong. It guesses only from short
    lists of known names and leaves a row empty otherwise.
  - Take A shows the four guessed rows, each labelled, and changes nothing.
  - Take B shows a guessed row, then sets by hand two rows the app would not guess.
    That is filling a blank, not correcting a wrong guess.
  - Take B stops at two of the six rows that study needs, the two the hepatic explorer
    reads. The page ends at 14 of 18 charts, with red "missing" tags still showing on
    three tabs and on the Hepatic ALT Waterfall chip.
- The dropdown's list is never seen (take B).
  - A native dropdown's list is not painted into a recorded page, and one left open
    swallows the next click. The row is focused (the ring shows) and the option is
    chosen with Playwright's `selectOption`, which fires the change event the app
    listens for. The value and the "chosen" label change on screen; the list does not
    appear.
- "Open the hepatic explorer" takes two clicks: the Labs and vitals tab opens on the
  Histogram, and the Hepatic Explorer chip is clicked next. That is how the app works.
- "Open the Biomarkers tab" is done, and three more clicks are added: a tile, a visit,
  and the association scatter.
- The pointer and the ring on each click are drawn by the script. Playwright's video
  has no pointer. The arrow follows the real mouse, and the ring marks a real press.
- Length: 1:50 and 2:06, against "about two minutes".
- Version: 1.9.2, not the 1.9.1 the brief named (see "App version").

## Console and network

- Console errors: none, in either take. Page errors: none.
- One console warning, take A, when the hepatic explorer opens: "1663 missing or
  non-numeric results have been removed." The chart prints the same sentence itself.
- Requests other than the file itself: none. Failed requests: none.

## Things seen in the app while driving it

Worth knowing before a live demo. None stopped the recording.

- Offline, the Biomarkers charts have no statistics.
  - Every one prints "Statistics are unavailable in this file: it loads nothing, so it
    cannot start R", and the over-time table's "One-way ANOVA p-value" row reads
    "Statistics unavailable". It is on screen from 1:29 in take A.
  - The Correlation matrix draws an empty grid and the Biomarker screen draws no chart
    at all, yet both chips read ready and the tab reads "5 of 5". Neither is opened in
    the video. Live and offline, stay on the group comparison and the association
    scatter.
  - The Biomarker screen's sidebar shows a developer's note about calling `init()`.
    It is known: [bio.viz#119](https://github.com/jwildfire/bio.viz/issues/119).
- The pilot study puts red sentences at the top of several charts.
  - Hepatic Explorer: "1663 missing or non-numeric results removed" and "46
    participants dropped (missing ALT/TB peak)".
  - Biomarkers: "110 left out: Not in the participant table". Those are the 110
    synthetic participants the labs file carries and `adsl.csv` does not.
  - All are true of the sample data, and all are red on a big screen.
- In the Hepatic Explorer on the pilot study, the "Normal Range (81.1%)" label in the
  bottom-left corner is covered by the points and cannot be read.
- The header is not sticky. After scrolling down in the Data view, or down a
  participant's profile, you have to scroll back to the top to reach the tabs.
- Clicking a file in the sidebar's loaded-data list jumps the page to its card, and
  the sidebar shifts up as it sticks. The pointer is left over the next file in the
  list, which lights up as if it had been the one clicked (0:29 in take A).
- With the pointer over the participant profile, a wheel scroll is shared between the
  profile's own body and the page, so each moves part of the way.
- Setting a mapping row makes the table's columns shift a few pixels.
- On the renamed-column study the hepatic explorer's "Migration (Sankey)" view is
  greyed out. It is not opened in the video and the reason was not looked into.
- Not tried: a real drag from Finder. The script synthesizes the drop. Worth one try
  by hand in the browser the talk will use.

## Re-record

```sh
cd keynote/_notes/demo-fallback
node record.mjs            # both takes, about four and a half minutes
node record.mjs pilot      # take A only
node record.mjs renamed    # take B only
```

- Needs Node, the Playwright in the safety.viz clone
  (`/Users/jwildfire/Documents/obot2/safety.viz/node_modules`, with its Chromium), and
  `ffmpeg` on the path for the `.mp4` and the 10-second frames. Without ffmpeg only
  the `.webm` is written.
- Each run replaces that take's videos, `run-*.json`, `steps/` and `frames/`.
- The run stops, and says where, if a check fails: a file not loaded or not placed, a
  row count that differs from the file, a chart that did not draw, a request other
  than the file itself, a console error, or a network that was not off.
- To record a newer release, download the single file again to
  `input/safety.viz-app.html`. To change the pace, edit `HOLD` at the top of
  `record.mjs`. To change the files, edit `TAKES`.
- To record the hosted app instead, the script would need changes: the hosted page
  loads the pilot study by itself and is not offline.

---

Drafted by Claude Code using Opus 5.5 on 2026-10-07. Not yet reviewed by @jwildfire.
