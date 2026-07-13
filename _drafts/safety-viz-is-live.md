---
title: "R/Pharma Diary #5 — Introducing safety.viz"
author: "Jeremy Wildfire"
excerpt: "safety.viz v1.0 modernizes 7 interactive safetyGraphics renderers. The first renderer took a few weeks; the next six took a weekend."
tags: RPharma AI ClinicalTrials SafetyGraphics SafetyViz DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 5
---
{% comment %} date: set on publish — this is the first of the reordered posts (5: safety.viz, 6: obot-claw → Claude Code transition, 7: obot.agent case study) {% endcomment %}

[My last post]({% post_url 2026-07-02-safetygraphics-heart-gsm %}) laid out the plan for `{safetyGraphics}` v2 and ended on the obvious question: *can we actually do this?* Here's the first big answer: [**safety.viz is live**](https://jwildfire.github.io/safety.viz/).[^ai]

## Intro to safety.viz

> **safety.viz is a charting library for monitoring clinical trial safety.**

**safety.viz** is an updated JavaScript framework that modernizes[^modern] the `{safetyGraphics}` renderers. Seven of the ten original `{safetyGraphics}` renderers are now shipped! The site includes robust demos of all the charts — go play with them [here](https://jwildfire.github.io/safety.viz/).

[![The safety.viz gallery — live demos of every chart](/assets/img/safety-viz-gallery.png)](https://jwildfire.github.io/safety.viz/)

As of now, 7 of the core `{safetyGraphics}` charts are live:

| Chart | What it shows |
|---|---|
| **[Safety Histogram](https://jwildfire.github.io/safety.viz/histogram/index.html)** | Distribution of any lab or vital-sign measure, with normal-range overlay, treatment-group small multiples, and a linked participant listing |
| **[Safety Outlier Explorer](https://jwildfire.github.io/safety.viz/outlier-explorer/index.html)** | Every participant's results over time as one line each, against the population — click a line to isolate a participant |
| **[Safety Results Over Time](https://jwildfire.github.io/safety.viz/results-over-time/index.html)** | Population distribution of a measure at each visit as box-and-whisker marks, with grouping and outlier flags |
| **[Safety Shift Plot](https://jwildfire.github.io/safety.viz/shift-plot/index.html)** | Baseline vs. comparison-visit values on a scatter — who moved, and which direction |
| **[Safety Delta-Delta](https://jwildfire.github.io/safety.viz/delta-delta/index.html)** | Paired change-from-baseline for two measures on one scatter (e.g. ALT change vs. AST change) |
| **[Adverse Event Timelines](https://jwildfire.github.io/safety.viz/ae-timelines/index.html)** | Each participant's AEs as timelines colored by severity, serious events marked, with click-through detail |
| **[Hep Explorer (eDISH)](https://jwildfire.github.io/safety.viz/hep-explorer/index.html)** | Peak ALT vs. peak bilirubin on Hy's-Law quadrants for drug-induced liver injury — click a participant for a coordinated drill-down: labs over time, visit path, and linked listing |

{% comment %} PUBLISH-GATE NOTES: (1) the hep-explorer chart + clinical-guide links point at main-site URLs that go live when the v1.2.0 site deploys (PR #44 merged to dev 07-12 ~8:17 pm ET; both paths verified against the dev-branch site generator). (2) Retake the gallery screenshot after that deploy — the current capture shows the v1.1.0 badge and "6 of 9 migrated"; post-deploy it reads "7 of 10", matching the prose. (3) Confirm the v1.2.0 timestamp in the Development Process timeline once the release is actually cut. {% endcomment %}

Point any of its seven interactive charts at your study data and review it in the browser: filter, group, zoom, and click through from a pattern on the screen to the participant records behind it. These are currently javascript only (usage instructions are [here](https://github.com/jwildfire/safety.viz#using-it)), but the `{gsm.safety}` R package should be done soon. Will share a follow-up post when it's live.

## Quality Framework

The most frequently asked question about safetyGraphics has always been: "Is it validated? Can I use it on actual studies?" The original answer was, "Not really. It's exploratory". `safety.viz` comes with a robust audit trail and extensive test evidence that is laying the foundation for GxP usage. Every chart traces to a reviewed requirement matrix from the original renderer's documentation, with 249 unit tests and 94 browser tests keyed to requirement IDs and published as [audit-style evidence reports](https://jwildfire.github.io/safety.viz/histogram/evidence.html). 

[![The Safety Histogram test-evidence report — requirement-traced, all passing, with CI provenance](/assets/img/safety-viz-evidence.png)](https://jwildfire.github.io/safety.viz/histogram/evidence.html)

## Development Process

The next few posts will share lots more details about how I built this, but here's a preview:

- **v0.1.0** (Jul 11, 8 am) — The first prototype was the heavy lift — I spent multiple sessions across a few weeks updating `safety-histogram`. I spent time reviewing the original charts, including the VERY helpful [requirement documents we had saved in the wikis](https://github.com/RhoInc/safety-histogram/wiki). Made lots of decisions about packages and test frameworks and then spent several sessions updating the website so that the example pages looked nice and clean and there was solid, transparent test evidence. 
- **v1.0.0** (Jul 11, 10:30 pm) — With the structure in place, things sped up A LOT. v1.0.0 added 5 renderers and came out later that same day.
- **v1.1.0** (Jul 11, 11:50 pm) — The next release took about an hour. It updated all of the examples to use data from `{pharmaverseadam}`, added a paneled all-measures view to the histogram, and updated the README.
- **v1.2.0** (Jul 12, 10 pm) — One day later, one of the most complex `{safetyGraphics}` renderers, `hep-explorer`, went live in `safety.viz`! AND it ported the incredibly robust [clinical guide](https://jwildfire.github.io/safety.viz/hep-explorer/guide.html) from PDF to HTML as part of the chart documentation.

The obvious question after a weekend like that is *how*? The next post starts that story with a tour of the new workshop — the move from the Obot experiment of [diary #2]({% post_url 2026-06-12-setting-up-obot-openclaw %}) to a Claude Code scaffold built around a public roadmap and an agent playbook.

[^ai]: **AI collaboration note** — this post was drafted by Claude Code (using Fable 5) from the `safety.viz` release notes and the project roadmap records; @jwildfire did a major re-write, and Claude did a final cleanup pass before publication.

[^modern]: What does "modernize" mean here? The original renderers were built on 2015-era Webcharts and D3 v3. safety.viz rebuilds each one on Chart.js in modern JavaScript, with JSON-Schema data contracts, requirement-keyed automated tests, and published evidence reports.
