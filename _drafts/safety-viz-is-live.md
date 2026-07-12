---
title: "R/Pharma Diary #5 — safety.viz is Live"
author: "Jeremy Wildfire"
excerpt: "The first big win shipped: safety.viz v1.0 with six interactive safety charts, and the seventh — eDISH, the big one — already in review. The first renderer took a few weeks; the next six took a weekend."
tags: RPharma AI ClinicalTrials SafetyGraphics SafetyViz DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 5
---
{% comment %} date: set on publish — this is the first of the reordered posts (5: safety.viz, 6: obot-claw → Claude Code transition, 7: obot.agent case study) {% endcomment %}

[Diary #4]({% post_url 2026-07-02-safetygraphics-heart-gsm %}) laid out the plan for `{safetyGraphics}` v2 and ended on the obvious question: *can we actually do this?* Here's the first big answer: [**safety.viz is live**](https://jwildfire.github.io/safety.viz/).[^ai]

The timeline is the story. Standing up the first renderer — the histogram — took a few weeks, because most of the work wasn't the chart. It was the machinery around the chart: requirement matrices harvested from the original documentation, a test-evidence pipeline, a docs site with live demos and API references. Then the next six renderers — including [hep-explorer](https://safetygraphics.github.io/hep-explorer/), the eDISH liver-safety display and by far the biggest of them — arrived in a single weekend, July 11–12. Weeks for the first one, a weekend for the next six. That curve is what building with AI agents feels like right now: the setup is the expensive part, and then the setup pays for itself all at once.

Seven of the ten original `{safetyGraphics}` renderers are now shipped or in review, and the seven include the hardest ones. Call it 80% of the way to the first big goal.

## v1.0, In Brief

From [the v1.0.0 release](https://github.com/jwildfire/safety.viz/releases/tag/v1.0.0):

> **safety.viz is a charting library for monitoring clinical trial safety.** Point any of its six interactive charts at your study data and review it in the browser: filter, group, zoom, and click through from a pattern on the screen to the participant records behind it.

| Chart | What it shows |
|---|---|
| **[Safety Histogram](https://jwildfire.github.io/safety.viz/histogram/index.html)** | Distribution of any lab or vital-sign measure, with normal-range overlay, treatment-group small multiples, and a linked participant listing |
| **[Safety Outlier Explorer](https://jwildfire.github.io/safety.viz/outlier-explorer/index.html)** | Every participant's results over time as one line each, against the population — click a line to isolate a participant |
| **[Safety Results Over Time](https://jwildfire.github.io/safety.viz/results-over-time/index.html)** | Population distribution of a measure at each visit as box-and-whisker marks, with grouping and outlier flags |
| **[Safety Shift Plot](https://jwildfire.github.io/safety.viz/shift-plot/index.html)** | Baseline vs. comparison-visit values on a scatter — who moved, and which direction |
| **[Safety Delta-Delta](https://jwildfire.github.io/safety.viz/delta-delta/index.html)** | Paired change-from-baseline for two measures on one scatter (e.g. ALT change vs. AST change) |
| **[Adverse Event Timelines](https://jwildfire.github.io/safety.viz/ae-timelines/index.html)** | Each participant's AEs as timelines colored by severity, serious events marked, with click-through detail |

Every chart ships with a live demo against real example data, a generated API reference, and its own test-evidence report. Mounting one is a few lines — vendor the committed bundle (no build step, no `npm install`) and hand it your rows — path shown for the current v1.1.0 bundle:

```html
<script src="dist/safety.viz-1.1.0/safety.viz.js"></script>
<script>
  SafetyViz.histogram('#container', {
    value_col: 'STRESN',
    measure_col: 'TEST',
    filters: [{ value_col: 'ARM', label: 'Treatment Group' }]
  }).init(rows); // rows: array of records, e.g. parsed from an ADaM BDS extract
</script>
```

Each chart declares its expected columns in a [JSON-Schema data contract](https://github.com/jwildfire/safety.viz/tree/main/src/data/schema) and validates its inputs on `init` — malformed rows are removed and counted, not silently plotted. Defaults follow ADaM-style column names (`USUBJID`, `TEST`, `STRESN`, `VISIT`…), and every mapping is a setting.

And the part I care about most, because it's the whole GxP thesis from diary #4: these are not new chart designs. Each one re-implements a display originally built by [Rho, Inc.](https://github.com/RhoInc) and used in practice under the `{safetyGraphics}` project ([full credits](https://jwildfire.github.io/safety.viz/about.html)). Every chart traces to a reviewed requirement matrix from the original's documentation, with 249 unit tests and 94 browser tests keyed to requirement IDs and published as [audit-style evidence reports](https://jwildfire.github.io/safety.viz/histogram/evidence.html) you can actually read — not just a green check on CI. The histogram's binning got an extra layer: cross-validated against the original renderer's executed source, 420 of 420 results matching across all six binning algorithms.

## The Fast Follows

**v1.1.0 shipped the same day** — agents don't stop for release parties. From [its notes](https://github.com/jwildfire/safety.viz/releases/tag/v1.1.0):

> The histogram gets a whole-dataset view, and the example data now comes from a scripted pharmaverse pipeline.
>
> - **All-measures overview for the histogram**: the chart now opens on small-multiple histograms of every measure in the data — an immediate feel for the overall shape of the dataset. Click a panel to drill into the familiar single-measure view.
> - **Scripted demo data**: the example datasets are now derived from pharmaverse ADaM sources (CDISC Pilot 01) by a committed, deterministic script — regenerable byte-identically, with provenance documented in the script header.
> - **README rewritten for users**: the repo front page now leads with the six charts, live demos, and a copy-pasteable mount snippet.
>
> No API changes — existing settings work unchanged. One behavior change: with no `start_value`, the histogram opens on the overview instead of the first measure.

**v1.2 is already queued.** The headliner is the eDISH port itself — the full hep-explorer, coordinated participant drill-down and all — currently in review as [PR #44](https://github.com/jwildfire/safety.viz/pull/44) with a [live preview](https://jwildfire.github.io/safety.viz/pr/44/hep-explorer/) you can click around today. Behind it sits a polish backlog pulled straight from the original's feature set: draggable Hy's-Law cut-lines, study-day animation, marginal box plots, summary-table sparklines. And after that, the last three renderers — the Paneled Outlier Explorer, Adverse Event Explorer, and Web Codebook — each already have a reviewed requirement matrix waiting.

## Next: The Workshop Tour

The obvious question after a weekend like that is *how*. The answer isn't a bigger model or heroic prompting — it's that the workshop got rebuilt around the work. The Obot of [diary #2]({% post_url 2026-06-12-setting-up-obot-openclaw %}) is gone: the always-on OpenClaw runtime shut down, the obot-claw account archived. What replaced them is a public roadmap ([obot.roadmap](https://github.com/jwildfire/obot.roadmap)) that plans the work, an agent playbook ([obot.agent](https://github.com/jwildfire/obot.agent)) that defines how it gets done, and pull-request review gates between the agents and anything that ships. That transition — what died, what survived, and what the new scaffold actually looks like — is the next post.

[^ai]: **AI collaboration note** — this post was drafted by Claude Code (using Fable 5) from the `safety.viz` release notes and the project roadmap records, and I reviewed and edited it before publication.
