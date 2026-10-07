# gsm KRI site report: the looping video for slide 12

A screen recording of the standard gsm KRI site report, for slide 12 ("Monitoring a
trial, as software"). It replaces the static screenshot `assets/gsm-report.png` and
loops while Jeremy talks. It is the real public example report doing real things:
nothing is mocked up and no result is edited.

Recorded 2026-10-07 at 05:59 PDT (12:59 UTC). Nothing here is committed or published.

## What is here

- The two files the deck uses, in `keynote/assets/`:
  - `gsm-kri-report-demo.mp4`: 54.9 seconds, 3.2 MB, 1600x900, 25 frames a second,
    H.264 (High), yuv420p, no sound, `faststart`.
  - `gsm-kri-report-demo-poster.png`: the video's first frame, 1600x900.
- In this folder:
  - `record.mjs`: the script that made them. Paths and settings are at the top.
  - `run.json`: what the run saw. Step times, the checks' readings, the served file's
    size and hash, every network request, every console line.
  - `gsm-kri-report-demo-raw.webm`: Playwright's own video of the same run (64 seconds,
    1408x792, VP8). It is not the source of the `.mp4`; see "How it was recorded".
  - `steps/`: the frame at each step, taken during the run.
  - `frames/`: a frame from the finished `.mp4` every 5 seconds, and the first and last
    screenshots of the run.

## The report

- Recorded as served, read only:
  [gilead-public.github.io/gsm.kri/examples/Example_SiteReport.html](https://gilead-public.github.io/gsm.kri/examples/Example_SiteReport.html)
  - It is the page the [gsm.kri README](https://github.com/Gilead-Public/gsm.kri) links
    as its "Site Report".
  - The served file: 12,930,785 bytes, last modified 2026-10-05 10:43:43 GMT, sha256
    `1b040642…4d64e3d5` (in full in `run.json`).
  - It is one file. The run made one network request, for the page itself.
- What the page says about itself (all of it is on screen in the first seconds):
  - Title: "Site KRI Overview"
  - "Study: AA-AA-000-0000 (OAK-38)"
  - "gsm.kri Example"
  - "Snapshot Date: 2025-04-01"
  - Study Status: Active, 148 of 150 sites activated, 760 of 1000 participants enrolled.
  - Study Overview: "37 Red KRIs", "94 Amber KRIs".
- The page shows no package version and no date it was built. The snapshot date is the
  only date on it.
- The data is the sample study bundled with `gsm.core` (the page's own "Setup" block
  reads `gsm.core::reportingResults` and its three sibling tables). It is synthetic.

## Steps and times

Times are positions in the video. They move by a few tenths of a second between runs;
the current ones are in `run.json` (`steps[].video`).

| Time | Step | What is on screen |
| --- | --- | --- |
| 0:00 | Top | The report as it opens: title, study, snapshot date, Study Status. |
| 0:03 | Scroll | Down to the Study Overview. |
| 0:04 | Overview | The site table: 36 sites with a red flag, a column per key risk indicator. Held 3 seconds. |
| 0:08 | A flagged site | The pointer goes to the first row, 0X1748 (Doe): 2 red flags, 1 amber. The row lights up. At 0:10 it rests on the row's red Adverse Event flag. |
| 0:12 | Scroll | Down to the Adverse Event Rate section. |
| 0:15 | Scatter plot | A point per site against the flag thresholds. One point is red. |
| 0:18 | Tooltip | The pointer on the red point. The tooltip names the same site: "Site: 0X1748 (Doe / 7 enrolled)", adjusted Z-score 3.22, 26 adverse events in 125 days. Held 3 seconds. |
| 0:23 | Pick the site | "Select Group" (top right) is set to 0X1748. Every other point fades, and the plot shows the site's tooltip by itself. |
| 0:28 | Bar Chart tab | Every site's score, highest first, the same site highlighted with its tooltip. |
| 0:33 | Metric Table tab | The flagged sites for this metric. 0X1748 is the first row, the only red flag. |
| 0:38 | Time Series tab | The sites' scores at the three snapshots, the site highlighted. |
| 0:43 | Tooltip | The pointer on the site's point: "Site 0X1748 on 2025-04-01". |
| 0:47 | Scroll | Back to the top. |
| 0:51 | Clear | "Select Group" is set back to None. |
| 0:54 | End | The report as it opened. The last frame is the first frame, so the loop does not jump. |

## Differences from the storyboard

The storyboard: the overview table; pick a flagged site so it highlights; scroll to one
metric; hover a flagged site on the scatter plot for its tooltip; show the time series
or bar chart; scroll back to the top.

- The hover comes before the pick, not after.
  - On this page, picking a site makes the scatter plot show that site's tooltip by
    itself. Done in the storyboard's order, the tooltip is already there when the
    pointer arrives and the hover shows nothing new.
  - So the video hovers the red point first (the tooltip appears), then picks the site
    (the other points fade).
- The site is picked with the "Select Group" dropdown, not by clicking it.
  - Clicking a row of the overview table changes nothing on the page.
  - Clicking a point on a chart highlights the site in that one chart only.
  - "Select Group" is the control that highlights a site across the report (42 of its
    45 charts; the other three belong to metrics with no result for this site).
- Picking a site does not highlight its row in the overview table. Only the charts
  change. The row lights up in the video because the pointer is on it.
- The dropdown's list is never seen.
  - A native dropdown's list is not painted into a headless page, and one left open
    swallows the next click. The pointer goes to the dropdown's arrow, a ring is drawn
    there, and the option is chosen with Playwright's `selectOption`, which fires the
    change event the report listens for. The value changes on screen; the list does not
    appear.
  - That ring is drawn without a real press. Every other ring in the video marks a real
    mouse press.
- The flag's own details are not seen in the overview table.
  - Each flag cell carries them as a native browser tooltip (a `title`), which a
    headless page does not paint. The scatter plot's tooltip shows the same numbers.
- Three tabs are shown, not one: Bar Chart, Metric Table and Time Series.
- The time series has one point for this site.
  - The site has a score at the latest snapshot only (its earlier snapshot has no
    score), so there is no line to follow, only the red point above the threshold.
- The selection is cleared at the end, which the storyboard did not ask for. It makes
  the last frame match the first.
- Not opened, on purpose: the Risk Score pop-up (see "Names on the page"), the "Show
  Details" switch, the "Setup" code block, the Site Subset and Country dropdowns.

## How it was recorded

- A headless Chromium (Playwright 1.61, borrowed from the safety.viz clone) opens the
  URL, waits for the charts to draw, and is then driven by a real mouse: eased moves,
  real presses, real wheel events.
- Zoomed to about 114%.
  - The report's text is 14 pixels; its tooltips are 12 and the table's column
    headings 11. The page is given a 1408x792
    window drawn on 1600x900 pixels, which is what a browser zoom does.
  - 1408 is the narrowest 16:9 window in which the report's 960-pixel charts fit beside
    its contents list. A larger zoom cuts the charts off on the right.
  - A CSS `zoom` on the page was tried first and dropped: the charts' tooltips stop
    answering the mouse.
- The `.mp4` is made from screenshots, not from the `.webm`.
  - Playwright's video ignores the zoom: it records the unzoomed 1408x792.
  - So the script takes full-size screenshots of the same page one after another
    throughout the run (1,302 of them, about 24 a second), and lays them on a steady 25
    frames a second. Each video frame is the newest screenshot taken by that moment.
  - The `.webm` is Playwright's video of the same run, kept as the plain record.
- "Trimmed" means the screenshots start once the report has loaded and drawn. The
  `.webm` starts about 6 seconds earlier, at the blank page.
- Scrolling is filmed a frame at a time.
  - A screenshot taken while a scroll is still on its way shows the report's fixed
    parts (the contents list and the "Select Group" box) knocked out of place by the
    distance just scrolled. A screen does not show that. The `.webm` has the same fault.
  - So during a scroll, each wheel event is followed by a wait for the page to draw and
    then one screenshot, placed a twenty-fifth of a second after the last. The three
    scrolls take about half as long again in real time as they do in the video. Nothing
    else in the video is re-timed.
- Drawn over the page by the script, because a recorded page shows no pointer: the
  cursor arrow, which follows the real mouse, and the ring on each press.
- After the last choice the script takes the keyboard focus off the dropdown, so its
  focus ring does not show in the last frame.
- The picture stands still twice, for about a third of a second each: at 0:23 and
  0:51, while the page redraws its charts after "Select Group" changes. That is the
  report, not the recording.

## Checks

- Looked at: every frame in `frames/` (one every 5 seconds), a frame a second across
  the whole video, and consecutive frames of each scroll.
  - Charts are drawn in every frame that should have one.
  - Both tooltips are legible at 1600x900.
  - No hold is mid-scroll; the fixed parts hold still through the scrolls.
- Console errors: none. Page errors: none. Console lines of any kind: none.
- Network: one request, the report itself. No failed request.
- The run's first and last screenshots are the same, byte for byte (`run.json`,
  `video.loopCloses`).
- The script stops, and says where, if a check fails: the report's title or snapshot
  date is missing, the page does not fit the window, a chart did not draw, a tooltip
  does not name the site, the selection did not take or did not clear, there is a
  console error, or the video is over 8 MB.

## Names on the page

For the lead, before this goes on a public slide.

- No company name is in the page's visible text, and none is in the video.
- "Gilead" appears on the page only inside two link addresses, neither shown:
  - The blue "gsm.kri" in the header links to `gilead-public.github.io/gsm.kri`. The
    video shows the link's text only.
  - Clicking a Risk Score in the overview table opens a pop-up that prints
    `https://gilead-public.github.io/gsm.kri/articles/SiteRiskScore.html` in full. The
    video does not click it.
- People: the investigators are placeholders. First names John, Joanne and Fred; last
  names Doe, Deer and Smith. The video shows "Doe", "Deer" and "Smith" beside the site
  numbers, and "Investigator First Name: John / Last Name: Doe" in the tooltips.
- Places are real place names on made-up sites: Kumamoto, Japan is in the tooltips.
  Elsewhere in the data, not shown: Tokyo, London, Milton Keynes, Foster City and
  Newtown Square.
- The study is a placeholder: "AA-AA-000-0000", nicknamed "OAK-38".
- Behind the "Show Details" switch, not opened: therapeutic area "Virology",
  indication "Hematology", phase "P2", product "Product Name 14".

## Things seen in the report

None stopped the recording. The first two are on screen.

- A developer's message is printed in the report, under the overview table: "Missing
  delta columns in dfResults: Flag_Change, Flag_Previous, … Not rendering list of newly
  changed flags.NULL", ending in a stray "NULL". It passes through the frame during the
  two long scrolls (about 0:13 and 0:48), for under a second each time.
- In the Bar Chart, the highlighted site's bar is the first on the left and its tooltip
  opens over it, so the bar itself is nearly hidden. The other bars are faded.
- The charts are 960 pixels wide in an 830-pixel column, so they run past the column's
  right edge and under the fixed "Select Group" box. At a window narrower than about
  1380 pixels they are cut off.
- The "Setup" block (collapsed, not opened) prints warnings from the build, among them
  "MetricID not found in dfBounds" and "Failed to parse strThreshold ('NA')".
- Clicking a row or a flag in the overview table writes a line to the browser console
  and does nothing else.

## Re-record

```sh
cd keynote/_notes/demo-kri-report
node record.mjs        # about a minute and a half
```

- Needs Node, the Playwright in the safety.viz clone
  (`/Users/jwildfire/Documents/obot2/safety.viz/node_modules`, with its Chromium), and
  `/opt/homebrew/bin/ffmpeg`. It needs the network: the report is read from its public
  URL.
- Each run replaces the `.mp4`, the poster, the `.webm`, `run.json`, `steps/` and
  `frames/`.
- The screenshots (a few hundred MB) go to a temporary folder and are removed when the
  `.mp4` is made. Set `KRI_CAPTURE_DIR` to put them somewhere else.
- Settings at the top of `record.mjs`:
  - `HOLD`: how long each state is held.
  - `SITE` and `METRIC`: the site followed and the section opened.
  - `WINDOW`: the zoom. 1600x900 is no zoom; 1408x792 is the most that fits.
  - `CRF`: the file size. 20 gives 3.2 MB; a higher number is smaller.
- If the published report changes, the checks say what no longer holds.

---

Drafted by Claude Code using Opus 5.5 on 2026-10-07. Not yet reviewed by @jwildfire.
