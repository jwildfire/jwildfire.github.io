---
title: "R/Pharma Diary #7 — Introducing safety.viz"  # #7 is the proposed slot — Jeremy's call
author: "Jeremy Wildfire"
excerpt: "The payoff post: safety.viz v1.0 shipped with six interactive safety charts — an agent-assisted re-implementation of the safetyGraphics renderers. What it does, how to use it, and why you can trust it."
tags: RPharma AI ClinicalTrials SafetyGraphics SafetyViz DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 7
---
{% comment %} No date field yet — the publication date is assigned when this draft moves from _drafts to _posts. {% endcomment %}

Back in [diary #4]({% post_url 2026-07-02-safetygraphics-heart-gsm %}), I laid out the plan for `{safetyGraphics}` v2 — keep what worked, modernize the framework, borrow GxP practices from `{gsm}` — and ended on the obvious question: *can we actually do this?*[^ai]

Here's the first real answer. Ten days later, `safety.viz` v1.0.0 shipped with six interactive charts, and v1.1.0 followed the same day. This is the "what actually got built" post I've been wanting to write since the series started.

**You can try every chart live right now: <https://jwildfire.github.io/safety.viz/>.**

## What It Is

`safety.viz` is a charting library for monitoring clinical-trial safety. Point any of its six charts at your study data and review it in the browser: filter, group, zoom, and click through from a pattern on the screen to the participant records behind it.

Under the hood it's a Chart.js library, and it's an agent-assisted re-implementation of the `{safetyGraphics}` interactive renderers — six of those displays so far, rebuilt on a modern engine. You vendor a committed bundle: no build step, no `npm install`, with an ESM build committed alongside for anyone who wants it.

## The Charts

| Chart | What it shows |
|---|---|
| **[Safety Histogram](https://jwildfire.github.io/safety.viz/histogram/index.html)** | Distribution of any lab or vital-sign measure, with normal-range overlay, treatment-group small multiples, and a linked participant listing |
| **[Safety Outlier Explorer](https://jwildfire.github.io/safety.viz/outlier-explorer/index.html)** | Every participant's results over time as one line each, against the population — click a line to isolate a participant |
| **[Safety Results Over Time](https://jwildfire.github.io/safety.viz/results-over-time/index.html)** | Population distribution of a measure at each visit as box-and-whisker marks, with grouping and outlier flags |
| **[Safety Shift Plot](https://jwildfire.github.io/safety.viz/shift-plot/index.html)** | Baseline vs. comparison-visit values on a scatter — who moved, and which direction |
| **[Safety Delta-Delta](https://jwildfire.github.io/safety.viz/delta-delta/index.html)** | Paired change-from-baseline for two measures on one scatter (e.g. ALT change vs. AST change) |
| **[Adverse Event Timelines](https://jwildfire.github.io/safety.viz/ae-timelines/index.html)** | Each participant's AEs as timelines colored by severity, serious events marked, with click-through detail |

Every chart ships with a live demo against real example data, a generated API reference, and its own test-evidence report.

## Using It

Mounting a chart is a few lines. Drop in the bundle and hand a chart your rows:

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

Each chart declares its expected columns in a [JSON-Schema data contract](https://github.com/jwildfire/safety.viz/tree/main/src/data/schema) and validates its inputs on `init` — malformed rows are removed and counted, not silently plotted, which matters when the thing on screen is supposed to represent someone's labs. Defaults follow ADaM-style column names (`USUBJID`, `TEST`, `STRESN`, `VISIT`…), and every mapping is a setting, so pointing a chart at differently-named columns is configuration, not a code change.

## Why You Can Trust It

This is the part I care about most, and the part a clinical audience should care about most.

These are not new chart designs. Each one re-implements an interactive display originally built by [Rho, Inc.](https://github.com/RhoInc) and used in practice under the `{safetyGraphics}` project ([full credits here](https://jwildfire.github.io/safety.viz/about.html)). We're not inventing new ways to look at safety data; we're carefully rebuilding displays that reviewers already trust.

And "carefully" has a specific meaning. Every chart traces to a reviewed requirement matrix harvested from the original's documentation. There are 249 unit tests and 94 browser tests, each keyed to a requirement ID, and they're published as [audit-style evidence reports](https://jwildfire.github.io/safety.viz/histogram/evidence.html) you can actually read — not just a green check on CI. The histogram's binning got an extra layer: we cross-validated it against the original renderer's real source, 420 out of 420 results matching across all six binning algorithms.

That evidence trail is the whole point of the GxP angle from diary #4. The interesting claim of this project was never "an agent can write a chart." It's that an agent can rebuild a regulated display *and leave behind the paperwork that lets a human sign off on it.*

## Already Moving

v1.1.0 landing the same day is a fair preview of the pace. The histogram now opens on an all-measures overview — small-multiple histograms of every measure in the dataset, so you get the overall shape at a glance, then click a panel to drill into the familiar single-measure view ([#39](https://github.com/jwildfire/safety.viz/issues/39)). The example data got a real pipeline, too: it's now derived from pharmaverse ADaM sources (CDISC Pilot 01) by a committed, deterministic script, regenerable byte-identically ([#35](https://github.com/jwildfire/safety.viz/issues/35)). And the overview shipped with five new reviewed requirements of its own (SH-OVW-001…005), because of course it did.

## For R Users

If you live in R, you don't touch the JavaScript. `{gsm.safety}` wraps this same bundle as `Widget_*` htmlwidgets — the histogram widget is next on its roadmap. And yes, I still owe you the proper `{gsm.safety}` introduction I promised at the end of diary #4; that's coming in a future post, now that the charts underneath it actually exist.

## What's Next

A seventh chart is already in review: the hep-explorer / eDISH port, opened as [safety.viz PR #44](https://github.com/jwildfire/safety.viz/pull/44) from an overnight agent run. That's a satisfying callback to diary #4, where I singled out eDISH as exactly the kind of display that matters to safety reviewers. How it got built — overnight, while I was asleep — is a story for another post.

And the port itself isn't finished: three `{safetyGraphics}` renderers — the Paneled Outlier Explorer, Adverse Event Explorer, and Web Codebook — are still to come, each with a reviewed requirement matrix already waiting.

[^ai]: **AI collaboration note** — this post was drafted by Claude Code (using Fable 5), adapting the `safety.viz` v1.0.0 and v1.1.0 release notes into the diary's voice, and I reviewed and edited it before publication.
